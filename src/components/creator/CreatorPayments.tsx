import React from 'react';
import { useAppState } from '../../context/StateContext';
import { getSafeCurrentCreator } from '../../data/demoFixtures';
import { CreatorFinanceCenter } from '../finance/CreatorFinanceCenter';

export const CreatorPayments: React.FC = () => {
  const { creators, userProfile, authUser } = useAppState();
  const currentCreator = getSafeCurrentCreator(creators, userProfile, authUser);

  const effectiveUserId = authUser?.id || currentCreator.id;

  return <CreatorFinanceCenter userId={effectiveUserId} />;
};
