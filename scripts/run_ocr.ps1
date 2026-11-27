Add-Type -AssemblyName System.Drawing
[Windows.Globalization.Language, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null

function Run-Ocr([string]$imagePath) {
    $file = [Windows.Storage.StorageFile]::GetFileFromPathAsync($imagePath).GetAwaiter().GetResult()
    $stream = $file.OpenAsync([Windows.Storage.FileAccessMode]::Read).GetAwaiter().GetResult()
    $decoder = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream).GetAwaiter().GetResult()
    $bitmap = $decoder.GetSoftwareBitmapAsync().GetAwaiter().GetResult()
    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
    $result = $engine.RecognizeAsync($bitmap).GetAwaiter().GetResult()
    return $result.Text
}

$imgPath = (Resolve-Path $args[0]).Path
$text = Run-Ocr $imgPath
Write-Output $text
