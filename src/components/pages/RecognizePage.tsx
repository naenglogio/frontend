/**
 * FE-4. 카메라/스캔 인식 화면 (RecognizePage)
 *
 * 문서: frontend/22_fe_recognize_page.md, shared/00_API_CONTRACT.md §4
 * 라우트: /ingredients/recognize
 *
 * 흐름:
 * 1) 모드 선택(바코드 / 영수증 / 사진)
 * 2) 웹캠 프리뷰 또는 앨범 업로드 → 미리보기
 * 3) recognize(image, mode) 호출 — multipart 에 image + mode(탭값) 전송
 * 4) 후보 선택 → /ingredients/new 로 food_id/name/category 프리필 전달 (FE-3)
 *
 * 디자인: 기존 토큰·Button/SegmentedControl 재사용 (02_DESIGN_SYSTEM.md)
 */
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../atoms/Button';
import { SegmentedControl } from '../atoms/SegmentedControl';
import { ApiError } from '../../services/authApi';
import { recognize } from '../../services/ingredientApi';
import type { IngredientCreatePrefill } from './IngredientCreatePage';
import type { RecognitionCandidate, RecognizeMode } from '../../types/features';

/** 스캔 모드 = API multipart `mode` 와 동일 (barcode / receipt / photo) */
type ScanMode = RecognizeMode;

/** SegmentedControl 옵션 (와이어프레임: 바코드 / 영수증 / 사진) */
const MODE_OPTIONS: { value: ScanMode; label: string }[] = [
  { value: 'barcode', label: '바코드' },
  { value: 'receipt', label: '영수증' },
  { value: 'photo', label: '사진' },
];

/**
 * 모드별 UI 문구
 * - guide: 프리뷰 위 가이드 텍스트
 * - captureHint: 카메라 준비 중 안내
 * - recognizeLabel: 인식 버튼 라벨
 */
const MODE_COPY: Record<
  ScanMode,
  { guide: string; captureHint: string; recognizeLabel: string }
> = {
  barcode: {
    guide: '바코드를 가이드 라인 안에 맞춰주세요',
    captureHint: '웹캠으로 바코드를 비추거나 이미지를 업로드하세요',
    recognizeLabel: '바코드 인식하기',
  },
  receipt: {
    guide: '영수증 전체가 잘 보이게 촬영해주세요',
    captureHint: '웹캠으로 영수증을 비추거나 이미지를 업로드하세요',
    recognizeLabel: '영수증 인식하기',
  },
  photo: {
    guide: '식재료가 잘 보이게 맞춰주세요',
    captureHint: '웹캠 권한을 허용해주세요',
    recognizeLabel: '이 사진으로 인식하기',
  },
};

/** API confidence(0~1) → 화면 뱃지용 퍼센트 */
function confidencePercent(confidence: number): number {
  return Math.round(Math.min(1, Math.max(0, confidence)) * 100);
}

/** 인식 후보 → FE-3 등록 화면 location.state 프리필 */
function toPrefill(candidate: RecognitionCandidate): IngredientCreatePrefill {
  return {
    name: candidate.name,
    category: candidate.category ?? undefined,
    // food_id 가 null(매칭 실패)이면 undefined 로 넘겨 등록 화면 기본값 사용
    food_id: candidate.food_id ?? undefined,
  };
}

export function RecognizePage() {
  const navigate = useNavigate();

  // DOM / MediaStream 핸들 — 언마운트·모드 전환 시 stopCamera 로 정리
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // 촬영 프레임을 File 로 뽑을 때 사용
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [mode, setMode] = useState<ScanMode>('photo');
  const [cameraDenied, setCameraDenied] = useState(false); // 권한 거부·웹캠 없음
  const [cameraReady, setCameraReady] = useState(false); // 메타데이터까지 준비되어 촬영 가능
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // object URL (해제 필요)
  const [imageFile, setImageFile] = useState<File | null>(null); // recognize() 에 넘길 원본

  const [recognizing, setRecognizing] = useState(false);
  const [candidates, setCandidates] = useState<RecognitionCandidate[] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const copy = MODE_COPY[mode];

  /**
   * 모드가 바뀔 때마다 웹캠을 다시 연다.
   * - 웹은 후면(environment)이 아니라 웹캠(user) 우선
   * - video 엘리먼트는 JSX 에서 항상 마운트해야 ref 에 스트림을 붙일 수 있음
   *   (cameraReady 이후에만 그리면 검정 화면 버그가 났음)
   */
  useEffect(() => {
    let cancelled = false;
    setCameraReady(false);
    setCameraDenied(false);
    setErrorMessage(null);
    // 모드 전환 시 이전 미리보기·인식 결과 초기
    setCandidates(null);
    setSelectedIndex(null);
    setImageFile(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });

    /** getUserMedia — user(웹캠) 실패 시 제약 없는 video 로 폴백 */
    async function requestStream(): Promise<MediaStream> {
      try {
        return await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'user' } },
          audio: false,
        });
      } catch {
        return navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
    }

    /** loadedmetadata 대기 — videoWidth 가 0인 채 캡처하면 검정 JPEG 만 생김 */
    function waitForVideoReady(video: HTMLVideoElement): Promise<void> {
      return new Promise((resolve, reject) => {
        const onReady = () => {
          cleanup();
          resolve();
        };
        const onError = () => {
          cleanup();
          reject(new Error('video error'));
        };
        const cleanup = () => {
          video.removeEventListener('loadedmetadata', onReady);
          video.removeEventListener('error', onError);
        };
        if (video.readyState >= 1 && video.videoWidth > 0) {
          resolve();
          return;
        }
        video.addEventListener('loadedmetadata', onReady);
        video.addEventListener('error', onError);
      });
    }

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        if (!cancelled) {
          setCameraDenied(true);
          setCameraReady(false);
        }
        return;
      }
      try {
        const stream = await requestStream();
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        // 첫 paint 직후면 ref 가 비어 있을 수 있어 한 프레임 대기
        let video = videoRef.current;
        if (!video) {
          await new Promise<void>((r) => requestAnimationFrame(() => r()));
          video = videoRef.current;
        }
        if (!video) throw new Error('video element missing');
        video.srcObject = stream;
        await waitForVideoReady(video);
        await video.play();
        if (cancelled) return;
        setCameraDenied(false);
        setCameraReady(true);
      } catch {
        // 권한 거부·장치 없음 → 업로드 UI 폴백
        if (!cancelled) {
          setCameraDenied(true);
          setCameraReady(false);
        }
      }
    }

    void startCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [mode]);

  /** previewUrl(object URL) 메모리 누수 방지 */
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  /** 트랙 중지 + video srcObject 해제 */
  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  /** 촬영/앨범에서 고른 File 을 미리보기·인식 입력으로 설정 */
  function replacePreview(file: File) {
    setImageFile(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setCandidates(null);
    setSelectedIndex(null);
    setErrorMessage(null);
  }

  /** 현재 video 프레임을 canvas → JPEG File 로 캡처 */
  function handleCapture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !cameraReady) return;

    // 크기 0이면 검정 이미지만 생기므로 미리보기에 올리지 않음
    if (!video.videoWidth || !video.videoHeight) {
      setErrorMessage('카메라가 아직 준비되지 않았어요. 잠시 후 다시 촬영하거나 앨범에서 선택해주세요.');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `${mode}-${Date.now()}.jpg`, { type: 'image/jpeg' });
        replacePreview(file);
      },
      'image/jpeg',
      0.92,
    );
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) replacePreview(file);
    // 같은 파일 재선택 가능하도록 value 초기화
    e.target.value = '';
  }

  /**
   * 이미지 인식 — 세 모드 공통 엔드포인트.
   * POST /ingredients/recognitions (multipart: image + mode).
   * 현재 탭(mode)을 그대로 넘겨 바코드/영수증/사진별 서버 분기.
   */
  async function handleRecognize() {
    if (!imageFile) {
      setErrorMessage('먼저 촬영하거나 이미지를 업로드해주세요.');
      return;
    }
    setRecognizing(true);
    setErrorMessage(null);
    setCandidates(null);
    setSelectedIndex(null);

    try {
      // 탭이 barcode 이면 mode=barcode — 빼면 서버가 photo 기본값(후보 다수)을 씀
      const res = await recognize(imageFile, mode);
      const list = res.candidates ?? [];
      setCandidates(list);
      if (list.length > 0) setSelectedIndex(0);
    } catch (error: unknown) {
      setCandidates(null);
      setSelectedIndex(null);
      if (error instanceof ApiError) {
        setErrorMessage(error.message || '인식에 실패했어요. 다시 시도해주세요.');
      } else {
        setErrorMessage('인식에 실패했어요. 네트워크 상태를 확인하고 다시 시도해주세요.');
      }
    } finally {
      setRecognizing(false);
    }
  }

  /** 선택 후보를 FE-3 등록 화면으로 넘김 (확인 후 추가 / 수정 동일 이동, 등록 폼에서 수정 가능) */
  function goToCreate() {
    if (selectedIndex === null || !candidates?.[selectedIndex]) return;
    navigate('/ingredients/new', { state: toPrefill(candidates[selectedIndex]) });
  }

  const selected = selectedIndex !== null ? candidates?.[selectedIndex] : null;

  return (
    <main className="min-h-screen bg-surface-muted pb-24">
      <div className="mx-auto max-w-xl px-5 pt-8">
        <h1 className="text-lg font-bold text-ink">스캔</h1>

        {/* 모드 탭 */}
        <div className="mt-4">
          <SegmentedControl
            options={MODE_OPTIONS}
            value={mode}
            onChange={(value) => setMode(value)}
          />
        </div>

        {/*
          카메라 영역 — 세 모드 공통.
          video 는 cameraReady 와 무관하게 항상 마운트 (스트림 부착용).
        */}
        <section className="mt-5 overflow-hidden rounded-card border-2 border-dashed border-line bg-surface shadow-soft">
          <div className="relative aspect-[4/3] bg-ink">
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`h-full w-full object-cover transition-opacity ${
                cameraReady && !cameraDenied ? 'opacity-100' : 'opacity-0'
              }`}
              aria-label={`${MODE_OPTIONS.find((o) => o.value === mode)?.label} 카메라 프리뷰`}
            />

            {/* 바코드: 가로 가이드 박스 */}
            {mode === 'barcode' && cameraReady && !cameraDenied && (
              <div
                className="pointer-events-none absolute inset-x-8 top-1/2 h-16 -translate-y-1/2 rounded-input border-2 border-primary-300/90"
                aria-hidden="true"
              />
            )}

            {/* 영수증: 전체 프레임 가이드 */}
            {mode === 'receipt' && cameraReady && !cameraDenied && (
              <div
                className="pointer-events-none absolute inset-6 rounded-card border-2 border-dashed border-primary-200/80"
                aria-hidden="true"
              />
            )}

            {/* 로딩 오버레이 */}
            {!cameraReady && !cameraDenied && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
                <p className="text-sm font-medium text-white/90">카메라를 준비하는 중이에요…</p>
                <p className="text-xs text-white/60">{copy.captureHint}</p>
              </div>
            )}

            {/* 모드별 촬영 가이드 문구 */}
            {cameraReady && !cameraDenied && (
              <p className="pointer-events-none absolute top-3 left-0 right-0 text-center text-xs font-medium text-white drop-shadow">
                {copy.guide}
              </p>
            )}

            {/* 권한 거부 → 업로드만 */}
            {cameraDenied && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface px-6 text-center">
                <p className="text-sm font-medium text-ink-soft">카메라 프리뷰</p>
                <p className="text-xs text-ink-muted">
                  카메라 권한이 없거나 사용할 수 없어요. 이미지를 업로드해주세요.
                </p>
                <Button type="button" variant="primary" onClick={() => fileInputRef.current?.click()}>
                  이미지 업로드
                </Button>
              </div>
            )}

            {/* 촬영 / 앨범 */}
            {!cameraDenied && (
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-ink/40 p-3">
                <Button type="button" variant="primary" disabled={!cameraReady} onClick={handleCapture}>
                  촬영
                </Button>
                <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                  앨범에서 선택
                </Button>
              </div>
            )}
          </div>
          {/* 캡처용 오프스크린 canvas */}
          <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </section>

        {/* 촬영·선택 이미지 미리보기 + 인식 CTA */}
        {previewUrl && (
          <section className="mt-4 overflow-hidden rounded-card border border-line bg-surface shadow-soft">
            <p className="px-4 pt-3 text-sm font-medium text-ink-soft">미리보기</p>
            <img
              src={previewUrl}
              alt="스캔 이미지 미리보기"
              className="mt-2 max-h-56 w-full object-contain bg-surface-muted"
            />
            <div className="p-4">
              <Button
                type="button"
                variant="primary"
                className="w-full"
                loading={recognizing}
                onClick={handleRecognize}
              >
                {copy.recognizeLabel}
              </Button>
            </div>
          </section>
        )}

        {/* 에러 안내 */}
        {errorMessage && (
          <p className="mt-4 rounded-input bg-danger/10 px-4 py-3 text-sm text-danger" role="status">
            {errorMessage}
          </p>
        )}

        {/* 인식 결과 검수 → 등록 연결 */}
        {candidates && (
          <section className="mt-5">
            <p className="mb-2 text-sm font-medium text-ink-soft">인식 결과 (검수)</p>
            {candidates.length === 0 ? (
              <div className="rounded-card border border-line bg-surface p-6 text-center shadow-soft">
                <p className="text-sm text-ink-muted">인식된 후보가 없어요. 다시 시도해주세요.</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {candidates.map((item, index) => {
                  const active = selectedIndex === index;
                  return (
                    <li key={`${item.name}-${index}`}>
                      <button
                        type="button"
                        onClick={() => setSelectedIndex(index)}
                        className={`flex w-full items-center justify-between gap-3 rounded-card border bg-surface px-4 py-3.5 text-left shadow-soft transition ${
                          active
                            ? 'border-primary-500 ring-2 ring-primary-100'
                            : 'border-line hover:border-primary-200'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                          {item.category && (
                            <p className="mt-0.5 text-xs text-ink-muted">{item.category}</p>
                          )}
                        </div>
                        {/* confidence 뱃지 (%) */}
                        <span className="shrink-0 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-700">
                          {confidencePercent(item.confidence)}%
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* 와이어프레임: 확인 후 추가(primary) / 수정(secondary) — 둘 다 등록 화면으로 이동 */}
            {selected && (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="primary"
                  className="w-full sm:flex-1"
                  onClick={goToCreate}
                >
                  확인 후 추가
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full sm:flex-1"
                  onClick={goToCreate}
                >
                  수정
                </Button>
              </div>
            )}
          </section>
        )}
      </div>

      {/* 하단 5탭 — 스캔 활성 (와이어프레임). 알림은 선영 담당으로 자리만 */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface"
        aria-label="하단 내비게이션"
      >
        <ul className="mx-auto flex max-w-xl justify-around px-2 py-2 text-[11px] font-medium text-ink-muted">
          <li>
            <Link to="/mainpage" className="flex flex-col items-center gap-0.5 px-2 py-1 hover:text-ink">
              홈
            </Link>
          </li>
          <li>
            <Link
              to="/ingredients"
              className="flex flex-col items-center gap-0.5 px-2 py-1 hover:text-ink"
            >
              냉장고
            </Link>
          </li>
          <li>
            <span
              className="flex flex-col items-center gap-0.5 px-2 py-1 font-semibold text-primary-600"
              aria-current="page"
            >
              스캔
            </span>
          </li>
          <li>
            <span className="flex flex-col items-center gap-0.5 px-2 py-1 opacity-50">알림</span>
          </li>
          <li>
            <Link
              to="/searchmap"
              className="flex flex-col items-center gap-0.5 px-2 py-1 hover:text-ink"
            >
              마트
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
