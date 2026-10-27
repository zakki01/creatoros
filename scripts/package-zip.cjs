const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceDir = 'C:\\Users\\zakki\\.gemini\\antigravity\\scratch\\creatoros';
const dest1 = 'C:\\Users\\zakki\\Downloads\\CreatorOS_Production_Ready.zip';
const dest2 = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4\\CreatorOS_Production_Ready.zip';

// Run PowerShell Compress-Archive or .NET ZipFile via script
const psScript = `
$sourceDir = '${sourceDir.replace(/\\/g, '\\\\')}'
$dest1 = '${dest1.replace(/\\/g, '\\\\')}'
$dest2 = '${dest2.replace(/\\/g, '\\\\')}'

if (Test-Path $dest1) { Remove-Item $dest1 -Force }
if (Test-Path $dest2) { Remove-Item $dest2 -Force }

$tempDir = Join-Path $env:TEMP ('creatoros_pkg_' + [System.Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tempDir | Out-Null

$exclude = @('node_modules', '.git', 'dist', '.cache', 'tmp')
Get-ChildItem -Path $sourceDir -Force | Where-Object { $exclude -notcontains $_.Name } | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination (Join-Path $tempDir $_.Name) -Recurse -Force
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $dest1, [System.IO.Compression.CompressionLevel]::Optimal, $false)
Copy-Item -Path $dest1 -Destination $dest2 -Force
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "Created $dest1 size: $((Get-Item $dest1).Length) bytes"
Write-Host "Created $dest2 size: $((Get-Item $dest2).Length) bytes"
`;

const tempPsFile = path.join(sourceDir, 'temp_package.ps1');
fs.writeFileSync(tempPsFile, psScript, 'utf8');

try {
  const result = execSync(`powershell -ExecutionPolicy Bypass -File "${tempPsFile}"`, { stdio: 'inherit' });
  console.log('Packaging successful');
} finally {
  if (fs.existsSync(tempPsFile)) {
    fs.unlinkSync(tempPsFile);
  }
}
