import { ChainId, CONTRACT_ADDRESSES, TokenName } from '@coti-cvi/lw-sdk'
import path from 'path'
import { AppEnv, DefineConfigReturnType } from './types'

export function defineConfig(processEnv: Omit<NodeJS.ProcessEnv, 'NODE_ENV'>): DefineConfigReturnType {
  return {
    ports: {
      [AppEnv.K8s]: {
        'data-feed': 80,
        'il-backend': 80,
        'il-monitor': 80,
      },
      [AppEnv.Local]: {
        'data-feed': 8000,
        'il-backend': 8001,
        'il-monitor': 8002,
      },
    },
    ilBackend: {
      calcMaxIlBasedOnXSecondsAgo: 60 * 60 * 24 * 30 * 18, // 18 months
      supportedPairContracts: CONTRACT_ADDRESSES.ethereum.pairs.filter(
        p =>
          (p.token0 === TokenName.WETH && p.token1 === TokenName.DAI) ||
          (p.token1 === TokenName.WETH && p.token0 === TokenName.DAI) ||
          (p.token0 === TokenName.WETH && p.token1 === TokenName.USDC) ||
          (p.token1 === TokenName.WETH && p.token0 === TokenName.USDC) ||
          (p.token0 === TokenName.WETH && p.token1 === TokenName.USDT) ||
          (p.token1 === TokenName.WETH && p.token0 === TokenName.USDT),
      ),
    },
    ilMonitoring: {
      runKeepersBotOnChainId: ChainId.PolygonStaging,
    },
    k8sConfigBase64:
      'YXBpVmVyc2lvbjogdjEKY2x1c3RlcnM6Ci0gY2x1c3RlcjoKICAgIGNlcnRpZmljYXRlLWF1dGhvcml0eS1kYXRhOiBMUzB0TFMxQ1JVZEpUaUJEUlZKVVNVWkpRMEZVUlMwdExTMHRDazFKU1VNMWVrTkRRV01yWjBGM1NVSkJaMGxDUVVSQlRrSm5hM0ZvYTJsSE9YY3dRa0ZSYzBaQlJFRldUVkpOZDBWUldVUldVVkZFUlhkd2NtUlhTbXdLWTIwMWJHUkhWbnBOUWpSWVJGUkplVTFFU1hoUFJFRTBUV3BaTVUxR2IxaEVWRTE1VFVSSmVFNXFRVFJOYWxreFRVWnZkMFpVUlZSTlFrVkhRVEZWUlFwQmVFMUxZVE5XYVZwWVNuVmFXRkpzWTNwRFEwRlRTWGRFVVZsS1MyOWFTV2gyWTA1QlVVVkNRbEZCUkdkblJWQkJSRU5EUVZGdlEyZG5SVUpCUzBKbkNqTjZjbXQzUkZVd1UyUXlWakJ5VFZKU05XZFdZbmhFTUV4b1dtbHRSMnhsWkRoQmVWVTNTSE0xYVdOUFREQkNhRFZOWm01R1JucFhWMjlWVVVjMWVsb0tVWFJQUzFGdWVGTlBNbUZMUVdkTmFEaGFVa0paTDBKUFdsSnJTbVZYYVVkc1NGUm5VMGxGVTA4eFRFdHBlR3gwV2xrMWJVSktURzFTVTJRM1pHVjRSZ3A1TUVGbmVsWnpWMjVrU0RVeWVXWm9ZVVZRZWxjMFNrbDNjMHQ2YldSaWIxQXdha3R6UVZabldUWlBiWGh6ZDFab1UxbHJiV014YjBrMmNrRTNTMUkxQ2tjME1ubGlkMVY1ZWtsMU1HeGFORWhoWlRkV1IxVXdNemRxV1RCWE9TOTNhSFlyZUZaWFdFZDFRWGR1ZGpaU1dtWlRRMDl2V1ZJdmNtSlJZbk16VUhFS2FGVnJZVGxuTjNwV2FqTTFSak0yYjBsSlYwTlBiVzkxYUU0cldGQlNhbmxoT1VGM09VRlNTa1JPT1V4UGMyc3lTRTkxY21saGEycHhVM05yTVVoVlFRcFBUbkYwTW1WaU9IVnVTbE01Y21VM1kybHpRMEYzUlVGQllVNURUVVZCZDBSbldVUldVakJRUVZGSUwwSkJVVVJCWjB0clRVRTRSMEV4VldSRmQwVkNDaTkzVVVaTlFVMUNRV1k0ZDBoUldVUldVakJQUWtKWlJVWkxZMXAwTWxObVZuVXhlakUyZFhSVWRYZEpkbFFyUmpsMmJXbE5RVEJIUTFOeFIxTkpZak1LUkZGRlFrTjNWVUZCTkVsQ1FWRkJWR2N5TDBaYVlWQkRTSHBoVHpRd00xVjFUMlUxZDAwckswcHdaelZNVGpjelMwaHhPRk5rWjA1WWRWUk1TVVZPVVFwSFJqWTFTR2hRVFdadVZ6VjZkbHBhUVcwM1VUSnNVbmRyYkM5MGVrZDVOekpuY0ZoS05FTmxhRWMwUm5GR1F6TkxZME50ZEZKQ1pIZGpMM1UwWm1KeUNtUlVhWGwxVWpBeU1YWTFabXBUYzBKRVJYWm5OVzVLYm01emFVRkNOemwxYTI1VEt6STJha2R3VjNCQ1dsVkNhVWhIUW5waGFIRkpSbXR6VFhGNllrc0tTVzBySzB4UFRqSkpSbmRpWkdOcU4zRkJVVkJpTDNNNGFHVjFZbEF3U1cweGVsSnRlV2N3TVZsT1NtOUNlVkpSYTFobGFFMXFWVWwzVWprd1NVeFNTUXBRWlhGT1JWQXhWR3cwUjFCeFFqWnZWWEJHU3pkNlIzY3Zlbll5UVdWRmVFcFlja1lyYUVacGRXMWFkekpRYTNSbWNXOXRaa0Z4VjNSb1puTnZLMlp6Q2paVWJETjBMMGxoVUVWV1VsWnhhM1ZwVWtaV09EWlVOMHNyUkdFMVRqUXdkbVUxZFFvdExTMHRMVVZPUkNCRFJWSlVTVVpKUTBGVVJTMHRMUzB0Q2c9PQogICAgc2VydmVyOiBodHRwczovLzdCQUUzQTVCMzhFMDg3NUNGRTg5MTAxREE3OTA1QzMwLnlsNC5ldS13ZXN0LTEuZWtzLmFtYXpvbmF3cy5jb20KICBuYW1lOiBhcm46YXdzOmVrczpldS13ZXN0LTE6NTIwODU5NTM4Nzg5OmNsdXN0ZXIvZWtzLTAxLWRldi1jdmkKY29udGV4dHM6Ci0gY29udGV4dDoKICAgIGNsdXN0ZXI6IGFybjphd3M6ZWtzOmV1LXdlc3QtMTo1MjA4NTk1Mzg3ODk6Y2x1c3Rlci9la3MtMDEtZGV2LWN2aQogICAgdXNlcjogYXJuOmF3czpla3M6ZXUtd2VzdC0xOjUyMDg1OTUzODc4OTpjbHVzdGVyL2Vrcy0wMS1kZXYtY3ZpCiAgbmFtZTogYXJuOmF3czpla3M6ZXUtd2VzdC0xOjUyMDg1OTUzODc4OTpjbHVzdGVyL2Vrcy0wMS1kZXYtY3ZpCmN1cnJlbnQtY29udGV4dDogYXJuOmF3czpla3M6ZXUtd2VzdC0xOjUyMDg1OTUzODc4OTpjbHVzdGVyL2Vrcy0wMS1kZXYtY3ZpCmtpbmQ6IENvbmZpZwpwcmVmZXJlbmNlczoge30KdXNlcnM6Ci0gbmFtZTogYXJuOmF3czpla3M6ZXUtd2VzdC0xOjUyMDg1OTUzODc4OTpjbHVzdGVyL2Vrcy0wMS1kZXYtY3ZpCiAgdXNlcjoKICAgIGV4ZWM6CiAgICAgIGFwaVZlcnNpb246IGNsaWVudC5hdXRoZW50aWNhdGlvbi5rOHMuaW8vdjFhbHBoYTEKICAgICAgYXJnczoKICAgICAgLSAtLXJlZ2lvbgogICAgICAtIGV1LXdlc3QtMQogICAgICAtIGVrcwogICAgICAtIGdldC10b2tlbgogICAgICAtIC0tY2x1c3Rlci1uYW1lCiAgICAgIC0gZWtzLTAxLWRldi1jdmkKICAgICAgY29tbWFuZDogYXdzCg==',
    mysql: {
      host: 'cvi-prod-db-01.c9t2avpr8qse.eu-west-1.rds.amazonaws.com',
      port: 3306,
      username: 'stav',
      password: 'e061cabef8e7726c7d6',
      database: 'cvi_prod',
      entities: [path.join(__dirname, '..', 'database', 'entities', '**', '*.entity.*')],
    },
    zapper: {
      zapperApiKey: '96e0cc51-a62e-42ca-acee-910ea7d2a241',
      // using rotating session type, see https://dashboard.smartproxy.com/residential-proxies/endpoints (more info in il-backend README.md)
      proxy: {
        host: 'gate.smartproxy.com',
        port: 7000,
        auth: { username: 'user-cotiilcvi', password: 'chileK2901!15' },
      },
    },
    sentry: {
      [AppEnv.K8s]: {
        enabled: true,
        dsn: {
          'data-feed': 'https://3106fc74c655443b894221630c28d670@o1152131.ingest.sentry.io/6261535',
          'il-backend': 'https://1c075f344a374c8892597f9cbb49a629@o1152131.ingest.sentry.io/6261536',
          'il-monitor': 'https://6eb45703f2f24073aba4304d14498652@o1152131.ingest.sentry.io/6387442',
        },
      },
      [AppEnv.Local]: {
        enabled: false,
        dsn: {
          'data-feed': 'https://fake@lala.ingest.sentry.io/1',
          'il-backend': 'https://take@lolo.ingest.sentry.io/2',
          'il-monitor': 'https://take@lolo.ingest.sentry.io/3',
        },
      },
    },
  }
}
