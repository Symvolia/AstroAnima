import Svg, { Circle, G, Line, Text as SvgText } from 'react-native-svg';
import { PLANET_BY_ID } from '../constants/planets';
import { useI18n, tPlanetAbbr, tSignAbbrByIndex } from '../i18n';
import { colors } from '../theme';
import type { Aspect, NatalChart } from '../types';

interface Props {
  chart: NatalChart;
  size?: number;
}

export function ZodiacWheel({ chart, size = 340 }: Props) {
  const { lang } = useI18n();
  const cx = size / 2;
  const cy = size / 2;
  const outer = size / 2 - 8;
  const inner = outer - 38;
  const planetR = inner - 28;
  const aspectR = inner - 58;
  const ascLon = chart.ascendant?.longitude ?? 0;
  const rot = 180 - ascLon;

  const toXY = (longitude: number, r: number) => {
    const rad = ((rot - longitude) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
  };

  return (
    <Svg width={size} height={size}>
      <Circle cx={cx} cy={cy} r={outer} stroke={colors.gold} strokeWidth={1.5} fill="rgba(0,0,0,0.55)" />
      <Circle cx={cx} cy={cy} r={inner} stroke="rgba(196,160,255,0.35)" strokeWidth={1} fill="none" />
      <Circle cx={cx} cy={cy} r={aspectR} stroke="rgba(123,44,191,0.35)" strokeWidth={1} fill="none" />

      {Array.from({ length: 12 }).map((_, i) => {
        const p = toXY(i * 30 + 15, outer - 16);
        return (
          <SvgText
            key={`sign-${i}`}
            x={p.x}
            y={p.y + 3}
            fill={colors.goldSoft}
            fontSize="8"
            fontWeight="600"
            textAnchor="middle"
          >
            {tSignAbbrByIndex(i, lang)}
          </SvgText>
        );
      })}

      {Array.from({ length: 12 }).map((_, i) => {
        const a = toXY(i * 30, outer);
        const b = toXY(i * 30, inner);
        return (
          <Line
            key={`div-${i}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="rgba(212,175,55,0.28)"
            strokeWidth={1}
          />
        );
      })}

      {chart.aspects.slice(0, 24).map((asp: Aspect, i) => {
        const pa = chart.planets.find((p) => p.id === asp.planetA);
        const pb = chart.planets.find((p) => p.id === asp.planetB);
        if (!pa || !pb) return null;
        const a = toXY(pa.longitude, aspectR);
        const b = toXY(pb.longitude, aspectR);
        return (
          <Line
            key={`asp-${i}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={asp.harmonious ? colors.harmonious : colors.tense}
            strokeWidth={asp.orb < 2 ? 1.6 : 1}
            opacity={0.7}
          />
        );
      })}

      {chart.planets.map((p) => {
        const pos = toXY(p.longitude, planetR);
        const meta = PLANET_BY_ID[p.id];
        return (
          <G key={p.id}>
            <Circle cx={pos.x} cy={pos.y} r="12" fill={colors.surfaceSolid} stroke={meta?.color ?? colors.gold} />
            <SvgText
              x={pos.x}
              y={pos.y + 3}
              fill={colors.cream}
              fontSize="7"
              fontWeight="700"
              textAnchor="middle"
            >
              {tPlanetAbbr(p.id, lang)}
            </SvgText>
          </G>
        );
      })}

      {chart.ascendant ? (
        <SvgText x={18} y={cy + 4} fill={colors.gold} fontSize="10">
          ASC
        </SvgText>
      ) : null}
    </Svg>
  );
}
