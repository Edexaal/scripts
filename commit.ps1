# Workflow for updating the reference links to libraries
git add -A
git commit
$CommitHash = (git rev-parse HEAD)
$Files = Get-Item "./f95/*", "./lc/*"
foreach ($File in $Files) {
    (Get-Content $File) -replace '[a-f0-9]{40}', $CommitHash | Set-Content $File
}
git commit --amend --no-edit