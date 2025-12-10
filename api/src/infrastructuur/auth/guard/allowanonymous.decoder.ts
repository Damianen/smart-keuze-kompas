import { SetMetadata } from '@nestjs/common';

export const Allow_Anonymous = 'AllowAnonymous';
export const AllowAnonymous = () => SetMetadata(Allow_Anonymous, true);