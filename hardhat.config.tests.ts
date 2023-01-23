import { HardhatUserConfig } from 'hardhat/config';

import config from './hardhat.config';
import 'hardhat-exposed';

// @ts-ignore  // vscode linter can't find this property. but it works, so ignore the warning 
config.exposed = {
    // the default prefix "$" doesn't works well.
    // Use "hardhat compile --config ./hardhat.config.tests.ts --force" to re-generate exposed contracts
    prefix: 'x'
};

export default config;
