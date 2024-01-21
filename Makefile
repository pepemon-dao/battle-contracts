.PHONY : typechain compile test compile-clean console run prettier integration deploy-mumbai deploy-fantom-testnet

typechain:
	./node_modules/.bin/typechain --target ethers-v5 --outDir typechain './artifacts/*.json'

compile:
	npx hardhat compile
	make typechain

compile-clean:
	npx hardhat clean
	rm -r ./typechain/*
	make compile

deploy-mumbai:
	if [ -d ./contracts-exposed ]; then rm -r ./contracts-exposed; fi
	npx hardhat deploy --network mumbai --tags SETUP_CARDS
	
deploy-fantom-testnet:
	if [ -d ./contracts-exposed ]; then rm -r ./contracts-exposed; fi
	npx hardhat deploy --network fantom_testnet --tags SETUP_CARDS

deploy-pepechain-testnet:
	if [ -d ./contracts-exposed ]; then rm -r ./contracts-exposed; fi
	npx hardhat deploy --network pepechain_testnet --tags SETUP_CARDS

test:
	# re-generate hardhat-exposed ontracts with compile --force
	npx hardhat --config ./hardhat.config.tests.ts compile --force
	@DISABLE_FORKING=1 npx hardhat --config ./hardhat.config.tests.ts test --no-compile

integration:
	# re-generate hardhat-exposed ontracts with compile --force
	npx hardhat --config ./hardhat.config.tests.ts compile --force
	@DISABLE_FORKING=1 npx hardhat --config ./hardhat.config.tests.ts --show-stack-traces test --bail --no-compile --verbose --deploy-fixture integration/IntegrationTest.ts

run-node:
	@npx hardhat node

prettier:
	prettier --write **/*.sol
	prettier --write "{**/*,*}.{js,ts,jsx,tsx}"

commit:
	git add .
	git commit -m "quick commit"
	git push

e2e:
	npx hardhat run integration/EndToEndStream.ts

maker:
	npx hardhat --network localhost run integration/makerIntegration.ts

balance:
	npx hardhat --network localhost run integration/helpers/GiveBalance.ts

time:
	npx hardhat --network localhost run integration/helpers/SkipTime.ts

coverage:
	npx hardhat coverage
