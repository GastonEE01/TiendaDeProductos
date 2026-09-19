import PropTypes from 'prop-types';

const sectionTypes = {
  className: PropTypes.string,
  topOuterDivider: PropTypes.bool,
  bottomOuterDivider: PropTypes.bool,
  topDivider: PropTypes.bool,
  bottomDivider: PropTypes.bool,
  hasBgColor: PropTypes.bool,
  invertColor: PropTypes.bool
};

const sectionDefaults = {
  className: undefined,
  topOuterDivider: false,
  bottomOuterDivider: false,
  topDivider: false,
  bottomDivider: false,
  hasBgColor: false,
  invertColor: false
};

export const SectionProps = {
  types: sectionTypes,
  defaults: sectionDefaults
};

export const SectionSplitProps = {
  types: {
    ...sectionTypes,
    invertMobile: PropTypes.bool,
    invertDesktop: PropTypes.bool,
    alignTop: PropTypes.bool
  },
  defaults: {
    ...sectionDefaults,
    invertMobile: false,
    invertDesktop: false,
    alignTop: false
  }
};

export const SectionTilesProps = SectionProps;
