import React from 'react';
import { DiscoverView } from './DiscoverView';

/**
 * SocialFeedView has been unified with DiscoverView to eradicate duplicate feeds,
 * dead code, and fragmented social state.
 */
export const SocialFeedView: React.FC = () => {
  return <DiscoverView />;
};

export default SocialFeedView;
