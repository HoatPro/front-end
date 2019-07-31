forever stop 'frontend@netdashboard'
NODE_ENV=production forever --id 'frontend@netdashboard' start -c "node --max-old-space-size=2096" -e forever-err.log server.js
sleep 1
forever logs
