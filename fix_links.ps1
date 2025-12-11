$files = Get-ChildItem -Path "D:\Hakaton_Project\Frontend\humanoid_robotics_book\book-site\docs" -Filter "*.md" -Recurse | ForEach-Object { $_.FullName }

foreach ($file in $files) {
    $content = Get-Content $file
    $content | ForEach-Object { $_ -replace "link_to_resource", "/docs/intro" } | Set-Content $file
}