set export
set dotenv-load

HARDHAT_NETWORK := "bscTestnet"

compile:
    npx hardhat compile

abi: compile
    #!/bin/env python
    import json
    import os
    from pathlib import Path

    cwd = Path.cwd()
    abi_home = cwd / "abi"
    contracts = cwd / "artifacts" / "contracts"

    for contract in contracts.iterdir():
        if not contract.is_dir():
            continue
        name, _ = os.path.splitext(contract.name)
        artifact = contracts / contract / f"{name}.json"

        with open(artifact, "r", encoding="utf-8") as f:
            abi = json.load(f)["abi"]

        name = "".join([name[0].lower(), *name[1:]])
        abi_file = abi_home / f"{name}.abi.json"
        with open(abi_file, "w", encoding="utf-8") as f:
            json.dump(abi, f, indent=2)
            f.write("\n")
        print(f"Generated {abi_file} for {name}")

deploy_token: compile
    npx hardhat run --network $HARDHAT_NETWORK scripts/deployToken.js

deploy_staking reward: compile
    node scripts/deployStaking.js $VITE_DUMMY_TOKEN_ADDRESS {{ reward }}

clean:
    npx hardhat clean
    rm -rf dist cache

