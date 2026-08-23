// Divisor curvo "curve2" do Divi — SVG real extraído do CSS gerado pelo WordPress
// (migration/css/home-1.css, regra .et_pb_bottom_inside_divider), não desenhado à mão.
// Uso: coloque dentro de uma section com `relative`, no final do conteúdo.
export default function CurveDivider({ color = "#FFFFFF" }: { color?: string }) {
  return (
    <svg
      className="absolute bottom-0 left-0 w-full h-[60px] sm:h-[100px]"
      viewBox="0 0 1280 140"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g fill={color}>
        <path
          d="M725.29 101.2C325.22 122.48 0 0 0 0v140h1280V0s-154.64 79.92-554.71 101.2z"
          fillOpacity=".3"
        />
        <path
          d="M556.45 119.74C953.41 140 1280 14 1280 14v126H0V0s159.5 99.48 556.45 119.74z"
          fillOpacity=".5"
        />
        <path d="M640 140c353.46 0 640-140 640-139v140H0V0s286.54 140 640 140z" />
      </g>
    </svg>
  );
}
