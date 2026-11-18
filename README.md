# shlok.portfolio

Source for the live portfolio at [shlokshetye.vercel.app](https://shlokshetye.vercel.app). The site is the static files in `src/`.

Preview from that folder:

```bash
cd src && python3 -m http.server 3000
```

`src/vercel.json` rewrites `/` to the homepage and maps the short case-study URLs (`/work`, `/merlin`, `/thine`, and the rest).
