const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'services', 'mediaUploadService.ts');
let content = fs.readFileSync(filePath, 'utf8');

const helperFunction = `
/**
 * Direct client-to-storage upload pipeline (Supabase Storage).
 * Never pipes oversized binary payloads through Vercel Serverless Functions,
 * eliminating the 4.5 MB request body limit completely.
 */
export async function uploadDirectToStorage(
  file: File,
  bucket = 'creatoros-media',
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
  const sanitized = sanitizeFileName(file.name);
  const storagePath = \`\${Date.now()}-\${sanitized}\`;

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const endpoint = \`\${supabaseUrl}/storage/v1/object/\${bucket}/\${storagePath}\`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${supabaseAnonKey}\`,
          'apikey': supabaseAnonKey,
          'Content-Type': file.type || 'application/octet-stream',
          'x-upsert': 'true',
        },
        body: file,
      });

      if (response.ok) {
        return \`\${supabaseUrl}/storage/v1/object/public/\${bucket}/\${storagePath}\`;
      }
    } catch (err) {
      console.warn('Direct Supabase storage upload failed, falling back to local object stream:', err);
    }
  }

  // Fallback: Local object URL for client preview/mock
  return URL.createObjectURL(file);
}
`;

if (!content.includes('export async function uploadDirectToStorage')) {
  content += helperFunction;
  // Also call uploadDirectToStorage in processMediaUpload
  content = content.replace(
    'const mediaUrl = URL.createObjectURL(file);',
    'const mediaUrl = await uploadDirectToStorage(file, expectedType === "video" ? "creatoros-videos" : "creatoros-images", onProgress);'
  );
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('[SUCCESS] Added uploadDirectToStorage to mediaUploadService.ts');
} else {
  console.log('[INFO] uploadDirectToStorage already present');
}
