import { describe, expect, test } from "vitest";
import { calculatePayout } from "./calculatePayout";
import { formatUnits } from "viem";
describe("Calculate results", () => {
  const totalVotes = 238n;
  const totalTokens = 2000000000000000000n;

  test("calculate payout", () => {
    const payout = calculatePayout(
      distributions[0].amount,
      totalVotes,
      totalTokens,
    );
    console.log(formatUnits(payout, 18));
    // expect(payout).toBe(false);
  });
});

const distributions = [
  {
    projectId:
      "0x005bcf117de0884513333371a7061d3cc87ea946c4b8507063a0fb8c26879b63",
    payoutAddress: "0xFF88877Fb37101A9d4e205F85Fa84aEDe3141D06",
    amount: 5.214285714285714,
  },
  {
    projectId:
      "0x20b54ce1a1048d2670c4b1d6d7d80a30a8c5cec7b29f178b1e155ca0b0ac6c29",
    payoutAddress: "0x47b184514709cAca5463660EB45b4a677Fee740E",
    amount: 5.153846153846154,
  },
  {
    projectId:
      "0x3058eb34788aeec3a817d436969d13a9963314f4c9d201e766cbd84a126e8935",
    payoutAddress: "0x677956D1c8c2643D02dCa400321a6De812099330",
    amount: 5,
  },
  {
    projectId:
      "0x9096256fd623d4e342e1a9347362a2f81317d7b22bee687556bc69bba2edccb6",
    payoutAddress: "0x9d263C49920ff75501Bb675A12b944595c4fd96C",
    amount: 4.8,
  },
  {
    projectId:
      "0xcf273ad1694f5a048520eda198b59b250b421ef3649b7153d9196ab9cc13d80d",
    payoutAddress: "0x47b184514709cAca5463660EB45b4a677Fee740E",
    amount: 4.533333333333333,
  },
  {
    projectId:
      "0xf9b123ffd4b691b96b8962a81bcbb687deccd2442b3e7a5a09413ad0dadc19d5",
    payoutAddress: "f15bfop5oxnnchnez27gd3ksir7z2k7m4xc3miejq",
    amount: 4.4375,
  },
  {
    projectId:
      "0x40bf2a32e5abce2f001fee83bfe271e0e9f73601e27f36ccd369017cc255df02",
    payoutAddress: "f1ruwohxq4p4oz5zz6zqd7osgd4sbus5phbmxtn5i",
    amount: 4.4375,
  },
  {
    projectId:
      "0x7bb1a190a4c05d9fdfe4db7bbb1a39d12672b0c742f822d26d94d5cdbdc9c565",
    payoutAddress: "f1nfsoiucyvjqz5asunxzojcaapnj3g5xjdafwrcq",
    amount: 4.375,
  },
  {
    projectId:
      "0xc590cfbdc339cf864e3eec0adb9ac3700f9b26f0e98cc8a24a4cae5f78ea849d",
    payoutAddress: "f2lr5n7yx4w4zujghar5azlmysjqe4ufct6gotyoi",
    amount: 4.3076923076923075,
  },
  {
    projectId:
      "0xf9f22dc2367a0a06b984f9dd6289f3b9e5b1e91c1da1c7ef14f8165f759fc11a",
    payoutAddress: "0xb7Bc3f7845442AfE741C0b81c4Bba0dB1B192d77",
    amount: 4.25,
  },
  {
    projectId:
      "0x9ae063ee72f5fa1f06e081f8ee50a606998ecd1fc95aef62803bdbf470096dad",
    payoutAddress: "0x5a8BC0b0eDd84C17BD8999Fb115DC65FFf2105d7",
    amount: 4.25,
  },
  {
    projectId:
      "0x696853234692ff7d86c93e7d3f5d2c0a287b53fecc457f9fe170796935088b17",
    payoutAddress: "f233526fcjwdulws2fwc3b32dhsbrzgbvh3png6ty",
    amount: 4.166666666666667,
  },
  {
    projectId:
      "0x173ad12dc7dde47816b620ac33b910e8be0619e2120d931e414bee91503a7ce8",
    payoutAddress: "f26ynkg6rodrwmh2b23tvetttk3sk5ravmmpyx7ma",
    amount: 4.111111111111111,
  },
  {
    projectId:
      "0xf0df62ab2411fb31acb45e1729346afed4e16490d1b9f3779972f575d3c74497",
    payoutAddress: "0x912DC03C136306eF6367Eb57aFd0812F39Cf35eb",
    amount: 3.9166666666666665,
  },
  {
    projectId:
      "0xe8defb750c7825389f439928f88af4bc03969d218f5c38edf4821612c90e3b84",
    payoutAddress: "f2fsgiojo3sa7rv5pwp3fgzh5rxknez4rppbhqady",
    amount: 3.875,
  },
  {
    projectId:
      "0x21126ef11678ce36c9019e3c12fbaa37607d631ac6bfa33ef5519b6d21587b7f",
    payoutAddress: "0x6dFf2d107e29E17F8Ea9b9aB1b82C3bB81EAA5FF",
    amount: 3.857142857142857,
  },
  {
    projectId:
      "0x12642b13555991f028115ca6833a4aa924eb147bc45fea97c9125bbb207f12f3",
    payoutAddress: "f2pucf7tgsbnr2pbl445a2ytdkkjesvwqduyy7y6a",
    amount: 3.6666666666666665,
  },
  {
    projectId:
      "0x2d595442b205c1b35eb28642b2db6f5e838112f2e63c92024dd4e9601845b269",
    payoutAddress: "f225ni6v547bnchfchdna4e4usiqpzaqrbta65h3a",
    amount: 3.5,
  },
  {
    projectId:
      "0xd1f19ff15b1034f7272f8c593a7a9e8cbb80d387247bda443f4da87c3f751c04",
    payoutAddress: "f1ukh6kumsgfxhlrm5cykpv5et2kxoxc76hvn53za",
    amount: 3.4444444444444446,
  },
  {
    projectId:
      "0xf1b5dadc1508e7fc85f74b0e5ba5c9a328e18e7ad5f88136c0a6b9c273d0350f",
    payoutAddress: "f1vm6glzaror64kpjtfzg53nw2yadzxtm5kxni7fq",
    amount: 3.2666666666666666,
  },
  {
    projectId:
      "0xf1b2b8bbe8d2bd2b786f7325378c8ea219750c0f22bd1c86a3074281c2ab80e3",
    payoutAddress: "0xf8E38E9f6450c0088754D90830ddfeAd26C303bC",
    amount: 3.25,
  },
  {
    projectId:
      "0x0c8d608b5440a069fd453703298ecc126c4f01cf520d45e6f9f167b14a60a257",
    payoutAddress: "0x8DFd03566Bf1b32eF0AeA70cCf5101870e871412",
    amount: 3.2142857142857144,
  },
  {
    projectId:
      "0x44de810ab1064ae33c97529244fb1e81f46ed9eb8936072b052a9b2ec92dbdd0",
    payoutAddress: "0x797cb3B256A5de5F75E068A8A3c72b07cBFff253",
    amount: 3.076923076923077,
  },
  {
    projectId:
      "0xdfee4120a71a1f19794db87d6504181ae1092b808e63b5cbb48c83dee02a9ada",
    payoutAddress: "0x63703B85f417834e258abc03ccA3Ee43bC513AAb",
    amount: 3,
  },
  {
    projectId:
      "0x453ba9809d32752f773ec79024f00338c0babb169094cd17f56e33918a37daa4",
    payoutAddress: "0xcad416d9710DdE13C3F690930bEa49472f065330",
    amount: 3,
  },
  {
    projectId:
      "0x6ea5475e579085525a029f55373e13a243e69acf4da808a15618ac841e4e84c8",
    payoutAddress: "0xe75358526Ef4441Db03cCaEB9a87F180fAe80eb9",
    amount: 3,
  },
  {
    projectId:
      "0x2d44c6aa5df5327311e40ec203560b468f44052adc10172bde7e5676f65637b5",
    payoutAddress: "0x53b7D4B38F36b243FC0AeE9fC1B9E368Ad54e98D",
    amount: 2.909090909090909,
  },
  {
    projectId:
      "0xce97de14580a1bbcd5593845027e479ec085beb71bf8af447ffcd7f7cf03bfe2",
    payoutAddress: "0xe993486B257Cd1481aef74b3B909A2627Fc8d305",
    amount: 2.9,
  },
  {
    projectId:
      "0xe005bfa9d9494de9433a92c1946a7e49fda5bd15bf9bf1b8e44c45caeac88aed",
    payoutAddress: "0x1eB050750e0591625f54017e2Ca5930a81c0E504",
    amount: 2.9,
  },
  {
    projectId:
      "0x2dffedbb37d66b002fa61950bad1c5c89e58c4c67097a746bd51f2dc0acd3f2f",
    payoutAddress: "f1xdpvmkm75sinulbz5j73wseupq4equmchxonvjy",
    amount: 2.9,
  },
  {
    projectId:
      "0xd10c17c04538f9b76e68939a8159f13219a1787f929b628b2abea0f564373487",
    payoutAddress: "f1gxbewlj3zf6zbmz6rl3jlffexdebbfeyycsev4q",
    amount: 2.888888888888889,
  },
  {
    projectId:
      "0x1a159dbe4eab156395dff7c1f71796a84436219374f7245205ea86714405b59c",
    payoutAddress: "f1tuexre7jvsfs7lphknf7elbcdphj4lk3m5z4oyi",
    amount: 2.875,
  },
  {
    projectId:
      "0xb5692a80728436bdc0db26d2de1c74db6a125566b1755c830b3ef20ae996b0f8",
    payoutAddress: "0xF647d5F999Ff4fffe177b89f57AceC8505cD2D87",
    amount: 2.8333333333333335,
  },
  {
    projectId:
      "0x852d9e9aa55c7da54dca72fa4802906c2af39b05eddd6d6711752f80253f6cf1",
    payoutAddress: "f2fsgiojo3sa7rv5pwp3fgzh5rxknez4rppbhqady",
    amount: 2.8181818181818183,
  },
  {
    projectId:
      "0x7aaaadd55ef47f1ae96fd3d5bae2b1dfad2dfd2287f633d6382a32fb15dad944",
    payoutAddress: "f2fsgiojo3sa7rv5pwp3fgzh5rxknez4rppbhqady",
    amount: 2.8,
  },
  {
    projectId:
      "0xb6cd5a5c89fbd23970a24d39d997d00e5254bb6f4039d4cd4bd5d18d754d7890",
    payoutAddress: "0x5f59b42865722d0926b011eA129D7d9403Bd5747",
    amount: 2.7777777777777777,
  },
  {
    projectId:
      "0x13c7c5908bfe2eff8601665febcf48d41f3d471a1caa2ca2dd78e5a1083ae0ba",
    payoutAddress: "0x4DeeA92E46cf25867EAfEb06D7c50ABf15129655",
    amount: 2.7333333333333334,
  },
  {
    projectId:
      "0xbfbd7090e9ef6e6cc74c75c1c92fde331899f1d8ec2015285e878e14d40db941",
    payoutAddress: "f2avxsjqarl7mev6zgs7npa7q54webmjsg67oj55y",
    amount: 2.7142857142857144,
  },
  {
    projectId:
      "0xf092ff4b7235a2fc30d398e434760caed0f0323acb70ad947f04568add91747e",
    payoutAddress: "0xb4713f39476841fAF0ea5a555d0b1d451e6B05A1",
    amount: 2.7,
  },
  {
    projectId:
      "0x06c3f5f9f155e3ed057d6e2459692c2f1482547613aab130edb8a6f136367db9",
    payoutAddress: "0xcB2E7F53F446AFA859192194Fc2E7eeCA20f6285",
    amount: 2.6923076923076925,
  },
  {
    projectId:
      "0x48a43552ebdda03f12ef5eb765af41c692ef68892c91cab62bf866588e1c642e",
    payoutAddress: "f2lr5n7yx4w4zujghar5azlmysjqe4ufct6gotyoi",
    amount: 2.6666666666666665,
  },
  {
    projectId:
      "0xc83b626dc947832889b19879042a25b234a10835b1ab18073a9682e81a711962",
    payoutAddress: "0x1F93480096797B441a5a2f48D04E05b9a91d07b5",
    amount: 2.6363636363636362,
  },
  {
    projectId:
      "0x36bc90afcc938cbb76cc781bc1a53c50dd99612c6630be0e9e5374f4f3605ad2",
    payoutAddress: "0xcad416d9710DdE13C3F690930bEa49472f065330",
    amount: 2.625,
  },
  {
    projectId:
      "0x6809bf9d16f69ac274462c66dffca57e95cb1a01f1ff299ac4ac73cee064a81e",
    payoutAddress: "0x3Ba2B9205A6230C2A957fed817d8E07BdB1cF542",
    amount: 2.6,
  },
  {
    projectId:
      "0xbad5b1ef0e513116a9f4da037fa3b5c9b8e35e744d9de8a45714c0caf205f0b8",
    payoutAddress: "0x67bCB304a19fb93DB03A2AE1B9EEe5b7f6930063",
    amount: 2.5,
  },
  {
    projectId:
      "0xb5b09424008711ce3af4a8bbd86010715d73998de6e20fd84d592dd36b2ad0d1",
    payoutAddress: "0x985fceAE89c474C2a62e6a39F328F93Ec776c315",
    amount: 2.5,
  },
  {
    projectId:
      "0xd6482a64a35ef956648af99b56e9f9c208e943135ec88faf5c2fa6f3a4fc753c",
    payoutAddress: "0x9875C621Fdda0b587C930130C9391BD912cF18d1",
    amount: 2.5,
  },
  {
    projectId:
      "0xf9fd0f85ed1a234d9c6e784d03b134171f67988ce61fa8ca749186aa83d98cbb",
    payoutAddress: "0x2CdfDbb2a3122DF9974fE45d35ddb83F0875e97E",
    amount: 2.3333333333333335,
  },
  {
    projectId:
      "0x51bb451c7b53e50caa82b81078b2f0a6e085dbde8df1d9cc706ac03139c37ee2",
    payoutAddress: "0xcad416d9710DdE13C3F690930bEa49472f065330",
    amount: 2.3333333333333335,
  },
  {
    projectId:
      "0xceb238d2abdfe413a919b6aefefed19b605ce604a2580d4d858608f836ffb67b",
    payoutAddress: "0xe18C96e166b4CBBbbd990B665AC4ACE565B5E4D6",
    amount: 2.3,
  },
  {
    projectId:
      "0x0199caad853c76c63bb74ce99e7b40a3bc61822270cab811f9801e6f0f8e1917",
    payoutAddress: "0x576edCed7475D8F64a5e2D5227c93Ca57d7f5d20",
    amount: 2.272727272727273,
  },
  {
    projectId:
      "0x0d4b487bf2933dae9946be2c5aa7d0a715d62ab3d4904c77bca5270f160f65ba",
    payoutAddress: "f1dxzpc5zdhblemvjhbc62pjava2rnxuz3l774wli",
    amount: 2.25,
  },
  {
    projectId:
      "0xf0419565c10ad5c378304cc153e19f64c4c75a0d5254300c2f6419f7e612aadf",
    payoutAddress: "f1xiahsn5gpv2k6hfzfvjv5qq3hm3hg3ropgftagi",
    amount: 2.25,
  },
  {
    projectId:
      "0xae3a3c2ec667aefc7891723b01bdfb46da5a24361675b645f55958e1eebc0317",
    payoutAddress: "0xA587F78A7Ace5DA371B03107fEAc02D67344e372",
    amount: 2.25,
  },
  {
    projectId:
      "0x2505a2126b7b69a2777a04e0db8a3724a234a75f47aa4bdd68a12c0b41644d51",
    payoutAddress:
      "f3rutut57upcbuzyq6si2xajhvr7d4u7exd7knqop4t6w3bpl57uqpdnfs72t2tyaz7vivwdvyc3bzvq2i37ma",
    amount: 2.25,
  },
  {
    projectId:
      "0x1995fc8da5b940c5e75cce7d7a8626c6bd3ad5175efc27d19899187caed8d67b",
    payoutAddress: "0xfaC6f66c67e2808337AF796Fe1b7Ca8CA0CeceB7",
    amount: 2.25,
  },
  {
    projectId:
      "0xb8c5cc1484583c325d25e63719a031aff25bf77e4a502bdd033a3434ce646f71",
    payoutAddress: "0xfb0cC1f4039BEA2B7E1575F5Cf070425Ec46Fb3f",
    amount: 2.2222222222222223,
  },
  {
    projectId:
      "0xdb739ebb63ae3cc9a7ba219025fe25f388666f396aff1c684c64d42724ac3dd9",
    payoutAddress: "0xb9ecee9a0e273d8A1857F3B8EeA30e5dD3cb6335",
    amount: 2.1666666666666665,
  },
  {
    projectId:
      "0xc3f44a872c3ff9b2268810097d10d1825fe484044bbe80bede989bf74451a914",
    payoutAddress: "0xE1C8ed0093A584678dB36eC753b2aBB10116C074",
    amount: 2.142857142857143,
  },
  {
    projectId:
      "0xfb72d11296f5dc58040b85b7a1656119474ec6caadf16a40fb123933b29bc863",
    payoutAddress: "0x40696c3503CD8248da4b0bF9d02432Dc22ec274A",
    amount: 2.1,
  },
  {
    projectId:
      "0x951b19d508e315c128080a220b0d284ff384d7c5e81ce99ef0853a0fe921d665",
    payoutAddress: "f1mbvqqbwxjbnrfuglfd4zvrisjvb2rw7jmzqjg7y",
    amount: 2.0833333333333335,
  },
  {
    projectId:
      "0x0348519ca7208232e607f1c14048159e58e575c5e11adcb01593eb6ffdfe40d7",
    payoutAddress: "f1pcyqpca73vte5m7skfmme7dqzowvtx6owgcgvaq",
    amount: 2,
  },
  {
    projectId:
      "0x88819231303c0c54f11ae6f13d46354baac746ebcb5e4f756be0a705fcabb515",
    payoutAddress: "0x224f21fCDf02F95AF3f744902353b4398a6c897b",
    amount: 2,
  },
  {
    projectId:
      "0x8cd3f9a9cea2ffffe1376cdd70b133d4d912140762f320dcfbcbe9ed5ab19a08",
    payoutAddress: "0xc202fC02e2C38226b6C433d589371D715f6F1819",
    amount: 1.8888888888888888,
  },
  {
    projectId:
      "0xb2971cdfbf8658c173f60317ed6e92e562478d762f3f7e7eaf07d541d2c54fad",
    payoutAddress: "f2lr5n7yx4w4zujghar5azlmysjqe4ufct6gotyoi",
    amount: 1.8333333333333333,
  },
  {
    projectId:
      "0x9f9552d2541dcc3ba3bcf6d4cc087c519bb345f6441f7fc166f085e71283e2f4",
    payoutAddress: "0xfaa3c610d7E113b3d8Bb95a33EFae07dbAA12d8B",
    amount: 1.7777777777777777,
  },
  {
    projectId:
      "0x6823dcbb2af114256b7f56071c8239f863284ebc58cff0bb4aff10ee8223ff39",
    payoutAddress: "0x29eD49c8E973696D07E7927f748F6E5Eacd5516D",
    amount: 1.75,
  },
  {
    projectId:
      "0xffe3621a6e8e2539b08b98e1a21c44753b088ac158fc544b6688fac0708b6cd8",
    payoutAddress: "0x2A545200dfce22c8F8F7c373abD342adC1C5999E",
    amount: 1.75,
  },
  {
    projectId:
      "0x96bc8ee8b55e88b70a78a97ffbb2980fc63e9f0880ed5042ea10af5350263118",
    payoutAddress: "0xcad416d9710DdE13C3F690930bEa49472f065330",
    amount: 1.75,
  },
  {
    projectId:
      "0xd45faee9e5d601e72148a87cc44ed61ea37db87ae19970d78f0ab0d78d752dfd",
    payoutAddress: "f1pmgmypxe72najp7kkwdi66ods3rlxryp65q7dqa",
    amount: 1.625,
  },
  {
    projectId:
      "0x4b20ec1c603f59810e43986da1965467a8a85beb422bd77c424ab172110c8cca",
    payoutAddress: "f2fmotntwfxab43bgnhbxttudfp5ncch7bsmacb6y",
    amount: 1.5714285714285714,
  },
  {
    projectId:
      "0x9449f0d41d6f8943f49940a82ee23bfc13ddf560b722487e4f4723843f6eb445",
    payoutAddress: "0x53b7D4B38F36b243FC0AeE9fC1B9E368Ad54e98D",
    amount: 1.5714285714285714,
  },
  {
    projectId:
      "0xd8ba4aa66fdfd245a373722b08c4def1456c59354847cfb9dfb0dc1cd8b45c29",
    payoutAddress: "f2lr5n7yx4w4zujghar5azlmysjqe4ufct6gotyoi",
    amount: 1.5,
  },
  {
    projectId:
      "0x2603fd107490ccf9c47944635e92f981c416c420233f5df364ffe3e7193da4bc",
    payoutAddress: "0xc2d203e737d64192cC4119d1e4D60BB51b603E4F",
    amount: 1.5,
  },
  {
    projectId:
      "0x32a8e4529f0f3cdb879018695c3951b3d5b43e33ae24890261b463580dc4b73f",
    payoutAddress: "0x6916BB61DbCb036Bc330a28504590Aa6534676a5",
    amount: 1.5,
  },
  {
    projectId:
      "0x2e854caa2ee7c1d255a13d1dd6793804f8cf3bbe8b34ba4514e2248966616730",
    payoutAddress: "0x67b471873EEb58Bf794445239512D7e21a209412",
    amount: 1.4285714285714286,
  },
  {
    projectId:
      "0x90d86d43d785684b45690894cb2ff4c73b027f4e0578d765bd4cbdb4347299d8",
    payoutAddress: "0x8309c58d0d2a6f4B4a87eb40FDAfe44aea50c163",
    amount: 1.4285714285714286,
  },
  {
    projectId:
      "0xc896ea2ed908822f5f9c2f3e4966d360093b644dd30f98e3e0cbd9dd94d7bb23",
    payoutAddress: "f2lr5n7yx4w4zujghar5azlmysjqe4ufct6gotyoi",
    amount: 1.2857142857142858,
  },
  {
    projectId:
      "0xc24a4f1f7f32fe5b4cfab7ea139a84da77fdb6b8c2e1473a93e75a26556eed42",
    payoutAddress: "f1pcyqpca73vte5m7skfmme7dqzowvtx6owgcgvaq",
    amount: 1.2857142857142858,
  },
  {
    projectId:
      "0x307859b0150f64ec1f631b4fce36fe2112c0bdadc9597f8a06628336aff39b9e",
    payoutAddress: "0xc4F9f60B22d57ff01E175A70fe96C6C90BF3fE82",
    amount: 1.25,
  },
  {
    projectId:
      "0xc989fffdc49afe91eac808050a05b085892d9a99898220d34d26fb5994b9afa3",
    payoutAddress: "f15hofssfzdtjv5agjuhrxw3kk5ym7rf2t2qabxni",
    amount: 1.1666666666666667,
  },
  {
    projectId:
      "0x932043643c5a967fd2521dff46f6e77263c28ba694a665650306c26b8f2e38f4",
    payoutAddress: "0x797cb3B256A5de5F75E068A8A3c72b07cBFff253",
    amount: 1.1428571428571428,
  },
  {
    projectId:
      "0xa8a3bd29a45df7a9fab951741a3d9831f8d690128bd0b58b72093c6745db599e",
    payoutAddress: "f1pmgmypxe72najp7kkwdi66ods3rlxryp65q7dqa",
    amount: 1,
  },
  {
    projectId:
      "0xf154dc86de73af49f110d659fe2b309059ac345f9349aa61937cf1706712f671",
    payoutAddress: "0x8559438cFCaFEB1f15068945846351582ea99872",
    amount: 1,
  },
  {
    projectId:
      "0x1dd6978a797fd868b6a82273883281fcd99872053819ea0c06b5f9795334a79f",
    payoutAddress: "0x9390fA8656A161442928b442300358D82bEC28b0",
    amount: 1,
  },
  {
    projectId:
      "0x7f16baad8422a9c8188c4e2bc7daca6e79bf7ce4989d3271cc87454a0297399f",
    payoutAddress: "f1qrgpdov6hncdbzhclbjbpxpd7ktgejn7d3a5j7q",
    amount: 1,
  },
  {
    projectId:
      "0xa502098a066a160f4c8b352a39093a75e8088574c4a3960dd00a8d915f6ca77b",
    payoutAddress: "f2fsgiojo3sa7rv5pwp3fgzh5rxknez4rppbhqady",
    amount: 0.8333333333333334,
  },
  {
    projectId:
      "0x9d02b56350b6406ca520051ffce52533831ff080d3a479be056ed85978450fb9",
    payoutAddress: "f1lb5g7wtgviz5i7mipvzjk633jv6jd3bo43zk3mi",
    amount: 0.8,
  },
  {
    projectId:
      "0x9bd032a66cd082ddf317145f72b6a0c05b559a78e6c5f78c41a35c2fd5628b7d",
    payoutAddress: "0x7b9741D876f1E7b0561C1D7f3795d8Df65D86215",
    amount: 0.8,
  },
  {
    projectId:
      "0xacd66876c0aeb6d467f679d267dc27a7ac679f869da7a99dffe079ecefdcc0e7",
    payoutAddress: "f1lb5g7wtgviz5i7mipvzjk633jv6jd3bo43zk3mi",
    amount: 0.8,
  },
  {
    projectId:
      "0x67f696285dce01b97c870caf6cbe9ad67a21e58b0882fc23c24452663ba39279",
    payoutAddress: "0xa0eDfC45763D20Eb6D846203814Fd7468b7F6D48",
    amount: 0.8,
  },
  {
    projectId:
      "0x8168c0368b1d4e32fec90360b0ae151530e134ee715bdeb089465cc1b7b63eb5",
    payoutAddress: "0x9DCbA70B2dfe5807e2A847E065EBb666791F8b8A",
    amount: 0.75,
  },
  {
    projectId:
      "0xb08d3a0055e122d2d660270b465dc1c2cfd091bf48fa3eca15944731d6df72ed",
    payoutAddress: "0x05FA612b66f2dDbf9b2733b8C6A771C6100FfCca",
    amount: 0.75,
  },
  {
    projectId:
      "0x60711569038e1b1be45503a71f2f3e29be6ada4c3f894a5f24b9f6cc178ec0e9",
    payoutAddress: "0x468755CcE6Ed3d9C8E8473Fe80Ab1f1D3382D96e",
    amount: 0.6666666666666666,
  },
  {
    projectId:
      "0x691609e0852e40b776a238df0833a458f9eb4357fa94376382845d856107ae90",
    payoutAddress: "f1lb5g7wtgviz5i7mipvzjk633jv6jd3bo43zk3mi",
    amount: 0.6666666666666666,
  },
  {
    projectId:
      "0xed9b91d8a490a97d1e12fac7e9600bec02fb8941aa834b69a625b00e1b7a9358",
    payoutAddress: "0xC34ad4A95adCD9021182fd5607ED822DB738E7c4",
    amount: 0.6666666666666666,
  },
  {
    projectId:
      "0xde7c3c8c5395cbc1156f3f9516ebf7ae3c1b341c7f75ea1e1c5bd8d89af22770",
    payoutAddress: "0x4B254cE1a75A695202Ac2AC495ffc34B6989F858",
    amount: 0.5555555555555556,
  },
  {
    projectId:
      "0xd6dde0b2ada20035ac755f017d90c57d13dc3aa6f7dea8a6022c08e0ef02635c",
    payoutAddress: "f1lb5g7wtgviz5i7mipvzjk633jv6jd3bo43zk3mi",
    amount: 0.5,
  },
  {
    projectId:
      "0x6aa947459da0486a7e75a487dae3aa3fca563eb4c6f194fd469a2c637fd91734",
    payoutAddress: "0xcE2982f465147B212432A8db27E3892D233588Dc",
    amount: 0.4,
  },
  {
    projectId:
      "0x3c2dd3048730465d9219a0decfb5b3e05abda34c5aaeb3a1f2a2a9be1fa40431",
    payoutAddress: "f1lb5g7wtgviz5i7mipvzjk633jv6jd3bo43zk3mi",
    amount: 0.4,
  },
  {
    projectId:
      "0xcb28c084834ace413c927980904032c0ef3a2d97338a27323f233e4fac8ff5d6",
    payoutAddress: "f1whkkocpljr776gcaaeim454zlmun6len2afndoi",
    amount: 0.2857142857142857,
  },
];
