
# Semi-Automated Farm Account Checker

Simple backend application written in Javascript for nodeJS.

Retreiving wallets from a single-row user submitted CSV file. The application pulls the total amount of CLP that are currently in the farm as well as the current reward debt (unclaimed rewards) of the wallets provided.




## Installation

To install all dependancies

```bash
  npm install
```
or
```bash
  yarn install
```
or
```bash
  pnpm install
```


## Usage

To retreive farm data. Only works withg the following tokens:  
`ewt`,`susu`,`wbct`,`wnct`,`wusdc`

```bash
  npm check [token]
```
or
```bash
  yarn check [token]
```
or
```bash
  pnpm check [token]
```

## Example


```bash
  npm check susu
```

