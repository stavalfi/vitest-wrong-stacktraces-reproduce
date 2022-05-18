import { BigNumber, BigNumberish, CallOverrides, Contract, ContractTransaction, Overrides, Signer } from 'ethers'
import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { fromBN, toBN, BigNumberCovertOptionalOptions, bigNumberToString } from './util'
import { TokenData, InteractableTokenName } from './data'

const DEFAULT_SIGNIFICANT_DIGITS = 6

export interface IERC20 extends Contract {
  allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<BigNumber>

  approve(
    spender: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>

  decimals(overrides?: CallOverrides): Promise<number>

  name(overrides?: CallOverrides): Promise<string>

  symbol(overrides?: CallOverrides): Promise<string>

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>

  transfer(
    to: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  transferFrom(
    from: string,
    to: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>
}

export class Token<T extends IERC20> {
  significantDigits = DEFAULT_SIGNIFICANT_DIGITS

  constructor(
    public readonly name: InteractableTokenName,
    public readonly symbol: string,
    public readonly decimals: number,
    public readonly contract: T,
  ) {}

  public static fromTokenData<T extends IERC20>(tokenData: TokenData, contract: T): Token<T> {
    return new Token<T>(tokenData.name, tokenData.symbol, tokenData.decimals, contract)
  }

  public static async createToken<T extends IERC20>(token: InteractableTokenName, contract: T): Promise<Token<T>> {
    const [symbol, decimals] = await Promise.all([contract.symbol(), contract.decimals()])
    return new Token(token, symbol, decimals, contract)
  }

  toAmount(amount: BigNumberish) {
    return toBN(amount, this.decimals)
  }

  fromAmount(amount: BigNumber) {
    return fromBN(amount, this.decimals)
  }

  async getBalance(address: string): Promise<BigNumber> {
    address = address || (await this.contract.signer.getAddress())
    return this.contract.balanceOf(address)
  }

  async transfer(signer: Signer, to: string, amount: BigNumberish): Promise<TransactionResponse> {
    const tokenAmount = this.toAmount(amount)
    return this.contract.connect(signer).transfer(to, tokenAmount)
  }

  async approveMax(signer: Signer, to: string, force = false) {
    if (!this.contract) {
      return
    }
    const from = await signer.getAddress()
    let allowance: BigNumber = await this.contract.allowance(from, to)

    if (!force && allowance.gt(MaxUint256.div(2))) {
      // Consider any allowance above half of max as enough - no need to re-approve since it's Infinity/2
      console.log('Skip setting approve max (already approved)')
      return
    }

    if (allowance.toString() !== '0') {
      await (await this.contract.connect(signer).approve(to, '0')).wait()
    }
    const reciept = await (await this.contract.connect(signer).approve(to, MaxUint256)).wait()

    allowance = await this.contract.allowance(from, to)
    console.log(`approve ${reciept.status ? 'success' : 'failed'}: allowance ${allowance}`)
    return reciept
  }

  toString(amount: BigNumber): string {
    const options: BigNumberCovertOptionalOptions = {
      commify: true,
      significantDigits: this.significantDigits,
    }
    return `${bigNumberToString(amount, { magnitude: this.decimals, ...options })} ${this.symbol}`
  }

  async balanceToString(account: string): Promise<string> {
    return this.toString(await this.getBalance(account))
  }
}
