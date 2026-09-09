import React, { useState, useEffect, useCallback } from 'react';
import {
  Cloud,
  X,
  UploadCloud,
  DownloadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  User as UserIcon,
  Clock,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout, getAccessToken } from '../utils/auth';
import {
  findDriveSaveFile,
  loadGameFromDrive,
  saveGameToDrive,
  GameSaveData,
} from '../utils/googleDriveSync';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  localSaveData: GameSaveData;
  onRestoreSave: (cloudData: GameSaveData) => void;
  onToast: (message: string) => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  localSaveData,
  onRestoreSave,
  onToast,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isCheckingCloud, setIsCheckingCloud] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [cloudFileInfo, setCloudFileInfo] = useState<{ id: string; modifiedTime: string } | null>(null);
  const [cloudSavePreview, setCloudSavePreview] = useState<GameSaveData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Explicit confirmation dialog state for mutating actions (MANDATORY per Workspace guidelines)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: 'backup' | 'restore';
    title: string;
    description: string;
  } | null>(null);

  // Initialize Auth state listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
      },
      () => {
        setCurrentUser(null);
        setCloudFileInfo(null);
        setCloudSavePreview(null);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Check cloud save file on user change
  const refreshCloudStatus = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) return;

    setIsCheckingCloud(true);
    setErrorMessage(null);

    try {
      const file = await findDriveSaveFile();
      setCloudFileInfo(file);

      if (file) {
        const preview = await loadGameFromDrive(file.id);
        setCloudSavePreview(preview);
      } else {
        setCloudSavePreview(null);
      }
    } catch (err: unknown) {
      console.error('Lỗi kiểm tra Google Drive:', err);
      const msg = err instanceof Error ? err.message : 'Không thể kết nối Google Drive';
      setErrorMessage(msg);
    } finally {
      setIsCheckingCloud(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && currentUser) {
      refreshCloudStatus();
    }
  }, [isOpen, currentUser, refreshCloudStatus]);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result?.user) {
        setCurrentUser(result.user);
        onToast(`Chào mừng ${result.user.displayName || 'bạn'}!`);
      }
    } catch (err: unknown) {
      console.error('Đăng nhập thất bại:', err);
      const msg = err instanceof Error ? err.message : 'Đăng nhập không thành công';
      setErrorMessage(msg);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await logout();
      setCurrentUser(null);
      setCloudFileInfo(null);
      setCloudSavePreview(null);
      onToast('Đã đăng xuất tài khoản Google');
    } catch (err) {
      console.error(err);
    }
  };

  // Backup flow with explicit confirmation
  const initiateBackup = () => {
    setConfirmDialog({
      isOpen: true,
      action: 'backup',
      title: 'Sao lưu tiến trình lên Google Drive?',
      description: `Thao tác này sẽ ghi đè dữ liệu lưu trên Google Drive bằng tiến trình hiện tại trên thiết bị này: Màn ${localSaveData.maxUnlockedLevel}, ${localSaveData.coins} Xu vàng. Bạn có muốn tiếp tục?`,
    });
  };

  const executeBackup = async () => {
    setConfirmDialog(null);
    setIsSyncing(true);
    setErrorMessage(null);

    try {
      const payload: GameSaveData = {
        ...localSaveData,
        lastSavedAt: new Date().toISOString(),
      };
      const result = await saveGameToDrive(payload);
      setCloudFileInfo(result);
      setCloudSavePreview(payload);
      onToast('Đã sao lưu thành công lên Google Drive!');
    } catch (err: unknown) {
      console.error('Sao lưu thất bại:', err);
      const msg = err instanceof Error ? err.message : 'Không thể lưu lên Google Drive';
      setErrorMessage(msg);
    } finally {
      setIsSyncing(false);
    }
  };

  // Restore flow with explicit confirmation
  const initiateRestore = () => {
    if (!cloudSavePreview) return;
    setConfirmDialog({
      isOpen: true,
      action: 'restore',
      title: 'Khôi phục tiến trình từ Google Drive?',
      description: `Tiến trình hiện tại trên thiết bị sẽ được thay thế bằng bản lưu đám mây: Màn ${cloudSavePreview.maxUnlockedLevel}, ${cloudSavePreview.coins} Xu vàng (Lưu lúc ${new Date(cloudSavePreview.lastSavedAt).toLocaleString('vi-VN')}). Bạn có chắc chắn muốn khôi phục?`,
    });
  };

  const executeRestore = () => {
    setConfirmDialog(null);
    if (!cloudSavePreview) return;
    onRestoreSave(cloudSavePreview);
    onToast('Đã khôi phục thành công tiến trình từ Google Drive!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-sky-200 p-5 text-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 tracking-tight leading-tight">
                ĐỒNG BỘ GOOGLE DRIVE
              </h3>
              <p className="text-[10px] text-sky-600 font-semibold">
                Lưu trữ & Khôi phục đám mây an toàn
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-3 p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span className="flex-1 font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3">
          {/* Auth State Box */}
          {!currentUser ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-400">
                <UserIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">
                  Đăng nhập để đồng bộ
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Kết nối Google Drive để lưu tiến trình chơi và tiếp tục trên các thiết bị khác.
                </div>
              </div>

              {/* Standard Styled Sign In With Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isAuthenticating}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-2xl shadow-xs font-bold text-xs transition-all active:scale-98 disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
                ) : (
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                )}
                <span>Đăng nhập với Google</span>
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-9 h-9 rounded-full border border-sky-300 shadow-xs shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-sky-200 text-sky-800 flex items-center justify-center font-bold text-xs shrink-0">
                    {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-black text-slate-800 truncate">
                    {currentUser.displayName || 'Người dùng Google'}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {currentUser.email}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                title="Đăng xuất"
                className="p-1.5 rounded-xl hover:bg-sky-100 text-slate-500 hover:text-slate-700 transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Progress Comparison Card */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-1.5 border-b border-slate-200/60">
              <span>Thông tin tiến trình</span>
              <span className="text-[10px] font-medium text-slate-400">So sánh</span>
            </div>

            {/* Local Stats */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold">Trên máy này:</span>
              </div>
              <div className="font-bold text-slate-800">
                Màn {localSaveData.maxUnlockedLevel} • {localSaveData.coins} Xu
              </div>
            </div>

            {/* Cloud Stats */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <div className="w-2 h-2 rounded-full bg-sky-500" />
                <span className="font-semibold">Google Drive:</span>
              </div>
              <div className="font-bold text-slate-800">
                {isCheckingCloud ? (
                  <span className="flex items-center gap-1 text-[11px] text-slate-400 font-normal">
                    <Loader2 className="w-3 h-3 animate-spin" /> Đang kiểm tra...
                  </span>
                ) : cloudSavePreview ? (
                  `Màn ${cloudSavePreview.maxUnlockedLevel} • ${cloudSavePreview.coins} Xu`
                ) : (
                  <span className="text-[11px] text-slate-400 font-normal">Chưa có bản lưu</span>
                )}
              </div>
            </div>

            {cloudSavePreview?.lastSavedAt && (
              <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                <Clock className="w-3 h-3" />
                <span>
                  Lần cuối: {new Date(cloudSavePreview.lastSavedAt).toLocaleString('vi-VN')}
                </span>
              </div>
            )}
          </div>

          {/* Sync Action Buttons */}
          {currentUser && (
            <div className="flex flex-col gap-2 pt-1">
              {/* Backup button */}
              <button
                type="button"
                onClick={initiateBackup}
                disabled={isSyncing || isCheckingCloud}
                className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 active:scale-98 transition-transform disabled:opacity-50"
              >
                {isSyncing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UploadCloud className="w-4 h-4" />
                )}
                <span>SAO LƯU TIẾN TRÌNH LÊN DRIVE</span>
              </button>

              {/* Restore button */}
              <button
                type="button"
                onClick={initiateRestore}
                disabled={!cloudSavePreview || isSyncing || isCheckingCloud}
                className="w-full py-2.5 px-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs shadow-xs flex items-center justify-center gap-2 active:scale-98 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <DownloadCloud className="w-4 h-4 text-sky-600" />
                <span>KHÔI PHỤC TỪ GOOGLE DRIVE</span>
              </button>
            </div>
          )}
        </div>

        {/* Explicit Confirmation Dialog (Workspace Mutation Compliance) */}
        {confirmDialog?.isOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-4 shadow-2xl border border-slate-200 flex flex-col gap-3 text-left animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h4 className="font-black text-sm text-slate-800">
                  {confirmDialog.title}
                </h4>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {confirmDialog.description}
              </p>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConfirmDialog(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={
                    confirmDialog.action === 'backup' ? executeBackup : executeRestore
                  }
                  className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition-colors"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
