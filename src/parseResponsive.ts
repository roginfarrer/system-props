import { SomeObject, SystemConfig, BreakpointsObject } from './types';

const createMediaQuery = (n: string) => `@media screen and (min-width: ${n})`;

export const parseResponsiveStyle = ({
  mediaQueries,
  systemConfig,
  scale,
  propValue,
  props,
}: {
  mediaQueries: Array<string>;
  systemConfig: SystemConfig;
  scale: string;
  propValue: Array<unknown>;
  props: SomeObject;
}) => {
  let styles = {};
  propValue.slice(0, mediaQueries.length).forEach((valueAtQuery, i) => {
    // e.g. <Box color={[theme => theme.colors.primary, theme => theme.colors.secondary]} />
    const value =
      typeof valueAtQuery === 'function'
        ? valueAtQuery(props.theme)
        : valueAtQuery;

    const media = mediaQueries[i];
    // @ts-ignore
    const style: SystemConfig = systemConfig(value, scale, props);
    if (!media) {
      styles = { ...styles, ...style };
    } else {
      styles = {
        ...styles,
        [media]: {
          // @ts-ignore
          ...styles[media],
          ...style,
        },
      };
    }
  });
  return styles;
};

export const parseResponsiveObject = ({
  breakpoints,
  systemConfig,
  scale,
  propValue,
  props,
}: {
  breakpoints: BreakpointsObject;
  systemConfig: SystemConfig;
  scale: string;
  propValue: { [x: string]: string | number | (({}) => string | number) };
  props: SomeObject;
}) => {
  let styles = {};
  for (const key in propValue) {
    const breakpoint = breakpoints[key];
    const valueAtQuery = propValue[key];
    // e.g.
    // <Box
    //   color={{
    //     [bp.bp320]: t => t.colors.primary,
    //     [bp.bp640]: t => t.colors.secondary
    //   }}
    // />
    const value =
      typeof valueAtQuery === 'function'
        ? valueAtQuery(props.theme)
        : valueAtQuery;
    // @ts-ignore
    const style = systemConfig(value, scale, props);
    if (!breakpoint) {
      styles = { ...styles, ...style };
    } else {
      const media = createMediaQuery(breakpoint);
      styles = {
        ...styles,
        [media]: {
          // @ts-ignore
          ...styles[media],
          ...style,
        },
      };
    }
  }
  return styles;
};
