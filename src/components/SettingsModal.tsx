import React from 'react';
import { Volume2, VolumeX, Music, Smartphone, Globe, X, Cloud, Info } from 'lucide-react';
import { GameSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onOpenGoogleDriveSetup?: () => void;
  onResetProgress?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenGoogleDriveSetup,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 p-5 text-slate-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            CÀI ĐẶT TRÒ CHƠI
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Setting Items */}
        <div className="flex flex-col gap-3">
          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Hiệu ứng âm thanh</div>
                <div className="text-[10px] text-slate-500">Tiếng rút ống chỉ, nổ trục</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.soundEnabled ? 'bg-sky-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Music Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Nhạc nền thư giãn</div>
                <div className="text-[10px] text-slate-500">Giai điệu nhẹ nhàng</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onUpdateSettings({ musicEnabled: !settings.musicEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.musicEnabled ? 'bg-purple-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  settings.musicEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Haptic Feedback */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Rung phản hồi (Haptic)</div>
                <div className="text-[10px] text-slate-500">Rung nhẹ khi chạm ống</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onUpdateSettings({ hapticEnabled: !settings.hapticEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.hapticEnabled ? 'bg-teal-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  settings.hapticEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Cloud Sync / Google Drive Backup Notice */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-sky-50/70 border border-sky-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
                <Cloud className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Sao lưu Google Drive</div>
                <div className="text-[10px] text-sky-700">Đồng bộ tiến trình màn chơi</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenGoogleDriveSetup}
              className="px-2.5 py-1 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] shadow-xs"
            >
              Đồng bộ
            </button>
          </div>

          {/* Google Ads Integration Info */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                <span className="flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Mạng quảng cáo Google Ads</div>
                <div className="text-[10px] text-slate-500">Google AdSense / H5 Game Ads</div>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold">
              Đang hoạt động
            </span>
          </div>

          {/* How to Play Guide */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
            <div className="font-black mb-1 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              <span>CÁCH CHƠI:</span>
            </div>
            • Chạm vào cụm ống chỉ để kéo ống trên cùng về trục xoay có màu tương ứng.<br />
            • Khi 1 đoạn trục được lấp đầy (4/4 ống), nó sẽ nổ và mở khóa đoạn tiếp theo.<br />
            • Bấm vào nút ▶️ trên đoạn bị khóa để xem quảng cáo mở khóa ngay lập tức!<br />
            • Dùng các nút bổ trợ (+ Slot, Chổi, Búa) khi gặp tình thế khó khăn.
          </div>
        </div>

        {/* Footer */}
        {onResetProgress && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-center">
            <button
              type="button"
              onClick={onResetProgress}
              className="text-[11px] text-rose-500 hover:text-rose-600 font-semibold"
            >
              Đặt lại toàn bộ tiến trình chơi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
