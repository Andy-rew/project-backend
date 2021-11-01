COMMIT=$(git rev-parse HEAD)
BRANCH=$(git rev-parse --abbrev-ref HEAD)
TIME=$(date +"%Y-%m-%d %H:%M")
JSON_PATH='./data/public/api/_build.json'
mkdir -p $(dirname ${JSON_PATH})
cat <<EOF > ${JSON_PATH}
{
  "commit": "${COMMIT}",
  "branch": "${BRANCH}",
  "time": "${TIME}"
}
EOF
