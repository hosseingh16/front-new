import type { AdList } from './ad'
import type { ProjectList } from './project'

export type OpportunityType = 'ad' | 'project'

export interface OpportunityAd {
  type: 'ad'
  item: AdList
}

export interface OpportunityProject {
  type: 'project'
  item: ProjectList
}

export type Opportunity = OpportunityAd | OpportunityProject
