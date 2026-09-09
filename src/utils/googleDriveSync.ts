import { getAccessToken } from './auth';

export interface GameSaveData {
  currentLevelNum: number;
  maxUnlockedLevel: number;
  coins: number;
  starsPerLevel: Record<number, number>;
  lastSavedAt: string;
}

const SAVE_FILE_NAME = 'thread_spool_puzzle_save.json';

/**
 * Searches for the app's save file on Google Drive
 */
export async function findDriveSaveFile(): Promise<{ id: string; modifiedTime: string } | null> {
  const token = await getAccessToken();
  if (!token) throw new Error('Chưa đăng nhập Google Drive');

  const query = encodeURIComponent(`name = '${SAVE_FILE_NAME}' and trashed = false`);
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime)`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Lỗi tìm file trên Drive: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  if (data.files && data.files.length > 0) {
    return {
      id: data.files[0].id,
      modifiedTime: data.files[0].modifiedTime,
    };
  }
  return null;
}

/**
 * Downloads the saved game progress data from Google Drive
 */
export async function loadGameFromDrive(fileId: string): Promise<GameSaveData> {
  const token = await getAccessToken();
  if (!token) throw new Error('Chưa đăng nhập Google Drive');

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Không thể tải dữ liệu: ${res.statusText}`);
  }

  const data = await res.json();
  return data as GameSaveData;
}

/**
 * Saves or updates game progress to Google Drive
 */
export async function saveGameToDrive(saveData: GameSaveData): Promise<{ id: string; modifiedTime: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Chưa đăng nhập Google Drive');

  const existing = await findDriveSaveFile();

  if (existing) {
    // Update existing file content
    const updateUrl = `https://www.googleapis.com/upload/drive/v3/files/${existing.id}?uploadType=media`;
    const res = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saveData, null, 2),
    });

    if (!res.ok) {
      throw new Error(`Không thể cập nhật file trên Drive: ${res.statusText}`);
    }

    return {
      id: existing.id,
      modifiedTime: new Date().toISOString(),
    };
  } else {
    // 1. Create file metadata
    const metaRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: SAVE_FILE_NAME,
        mimeType: 'application/json',
        description: 'Bản lưu tiến trình trò chơi Thread Spool Puzzle',
      }),
    });

    if (!metaRes.ok) {
      throw new Error(`Không thể tạo file trên Drive: ${metaRes.statusText}`);
    }

    const fileMeta = await metaRes.json();
    const fileId = fileMeta.id;

    // 2. Upload content to the newly created file
    const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
    const uploadRes = await fetch(uploadUrl, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saveData, null, 2),
    });

    if (!uploadRes.ok) {
      throw new Error(`Không thể lưu nội dung vào file: ${uploadRes.statusText}`);
    }

    return {
      id: fileId,
      modifiedTime: new Date().toISOString(),
    };
  }
}
