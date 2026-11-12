import { jsx as _jsx } from "react/jsx-runtime";
const hue = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7);
export default function Avatar({ name, url, size = 40 }) {
    if (url)
        return _jsx("img", { src: url, alt: name, loading: "lazy", className: "rounded-full object-cover", style: { width: size, height: size } });
    return _jsx("div", { className: "rounded-full grid place-items-center text-white font-bold shrink-0", "aria-label": name, style: { width: size, height: size, background: `hsl(${hue(name)} 55% 38%)`, fontSize: size / 2.2 }, children: [...name.trim()][0] ?? '?' });
}
