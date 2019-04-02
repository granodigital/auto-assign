const nock = require('nock');

// Teams getByName
// @ts-ignore
nock('https://api.github.com:443', { encodedQueryParams: true })
	.get('/orgs/granodigital/teams/ecommerce-developers')
	.reply(
		200,
		[
			'1f8b08000000000000039d554d6f9b4010fd2b88b36d0cc4498c14f5d07c28071455b2d23617b4c018365e76d17ee03a51fe7b67013738a471d31b3bcc9b999d79f3f6d9e5a4023772e1aba82a90193897d000133548e54e5c9abb51b00883e5fc74e2729143622d6e7cf9edf4fee6be4c57b77efc74bb882f7f5ea0b762a6b0b1b23ed6341fc6ca416592d69a0a8e4e98e6aeb6296a491b92',
			'edd09431a1204793910c8fa5d6b58a3c8fd47456505d9a7486813d0da4525e5f143a97ba62c92162e02d64a1bc4212ac9da299b01eff971a2ba852bcf99b781f55e0f590e7fee3054b92500b45b590143e15aac5d99680aca8525da36ac318da320944439e108dad09e6fed9d49f4f83c5ca0fa3c5323a397fb07dabf3a33efb1b66c2700cb5e8ab4dfa73184e5cec19e1f48974937a769928a81dd9b08d98cd3221f4433ff0971865488eabdddd66b97b08ae0df95197f90d6bd2c7f857fc74b58b571bffd8804723db77f4e3a98c60debe9d4842ae8f0c628cee509660426c3e8d6e41b6494a99632418e7ee5008ff273e8ef1ef70b23629a359f29f010fd143ae93866822df8ea6352abfdf5ba3505904d7388676858db7e7cd97e6e204af79280d31911bd00e0392837428777409ce35e59caad241b9e09af202edb9515aee66ce7740abc80d8a57bfe40ee1f9ab27666f6806aab5a646510e4a3956e25a8a2b470966daaf19d6d20be28dd50c3c62bd35e1284f1cf770e2a6b80c036dda6eb7b3762d666beaa1371359bf362e16cc30211aa122d40a5a4b87a40149d714752e5a13a600f94554325cb9042ff3089956071e7f346537fedf4fa7e37be407a820ddb40baa6c98f9c45d0bc6c4d68afaeb09bbd89e3e56d0375b3fd6a1f9f9343859f9411484f856bca743cbe9dc9ffa9dcf79149e591fbdabedbb7337d49a9797df1798cf9a90060000'
		],
		[
			'Server',
			'GitHub.com',
			'Date',
			'Tue, 02 Apr 2019 13:38:17 GMT',
			'Content-Type',
			'application/json; charset=utf-8',
			'Transfer-Encoding',
			'chunked',
			'Connection',
			'close',
			'Status',
			'200 OK',
			'X-RateLimit-Limit',
			'5000',
			'X-RateLimit-Remaining',
			'4554',
			'X-RateLimit-Reset',
			'1554215897',
			'Cache-Control',
			'private, max-age=60, s-maxage=60',
			'Vary',
			'Accept, Authorization, Cookie, X-GitHub-OTP',
			'ETag',
			'W/"64b7a70305e01142421aadfd2f62692f"',
			'Last-Modified',
			'Wed, 25 Oct 2017 13:59:48 GMT',
			'X-OAuth-Scopes',
			'repo',
			'X-Accepted-OAuth-Scopes',
			'admin:org, read:org, repo, user, write:org',
			'X-GitHub-Media-Type',
			'github.v3; format=json',
			'Access-Control-Expose-Headers',
			'ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type',
			'Access-Control-Allow-Origin',
			'*',
			'Strict-Transport-Security',
			'max-age=31536000; includeSubdomains; preload',
			'X-Frame-Options',
			'deny',
			'X-Content-Type-Options',
			'nosniff',
			'X-XSS-Protection',
			'1; mode=block',
			'Referrer-Policy',
			'origin-when-cross-origin, strict-origin-when-cross-origin',
			'Content-Security-Policy',
			"default-src 'none'",
			'Content-Encoding',
			'gzip',
			'X-GitHub-Request-Id',
			'3A6D:1134:CDD0F0:201E07B:5CA365C9'
		]
	);

// Teams listMembers
// @ts-ignore
nock('https://api.github.com:443', { encodedQueryParams: true })
	.get('/teams/2532906/members')
	.query({ per_page: '100' })
	.reply(
		200,
		[
			'1f8b0800000000000003ad965d8ba3301486ff8bd7659cd67e4359163a30377559d82ebb2c43c9d88ca6931ad1685bcbfcf73d1a33ad4e3f4822bd6891f33e791b7d30ff8e16653e09ada995114a3145c11a8759caac8e45d6d674e838835ebf63856c8d57c5056b31ff39fcfdc7a5dee66fbec89707f7fb6c06c328431cc5ab34a63013701e2553db161793de834f7890bea6098e3d16721cf2078f6dedd416f86fd9ac0f083fae20e53a70a1018b48c511618025f697d201dfd2460bb17819fa32fec628653b',
			'20359bdf5fccfecc4255f19b84be3607b2479bf100c326c25ffb283684245ca758993bdac517dcb38294c0bd89f15aa35c95846abb105a1ded1847ac44a6af891793881316ea94ace581c7621f852447ba3cc8278029eae9d4297390c7193c9d3a00113cda514c32e41d8a2d8ab1874906dbae0d6d1080c90f11063b96f08814378170bc42eb6d21f01ba209fee89c847e46941214c25821d4783cec3ace6593fdbebb79ca173b039305dec0e453dbdb0a9fe694dcad62fad2d60126b64a9291a612d29e9f9fc473b175c494205523654e5d45996cc7c1538f9abe6af251b44f2bf326e3d164d4bb6cde7bdfcddf9d857fd73ce7ea3b54e00dccabaaded6ae1a5272aec8e80b779636b1adc418a95612daf34ce04c252b29aa86952175bdca583b6e550d0cc40a89c7a459dde168009fee65b79e7a6ebe74dc5fde1e44bc753e7dbcea965cc0c02ed9f7b65e724ac9af32a42fd879dcc430c131524c20da73ace2994a2630aa968994ba6622d78e67b28381689b346049cae06c89e519d2e98ec7a3fe6872d9b7c5fec7dc77dcb937b8e3dbf577995cc0c0b746eddbda358695ec3bcfea4b788162e2620d67a4648dd49e9975aca9a0359aaaa7b5b0baaeb5783bd6361aa9cafbf21f4bcf346ece110000'
		],
		[
			'Server',
			'GitHub.com',
			'Date',
			'Tue, 02 Apr 2019 13:36:38 GMT',
			'Content-Type',
			'application/json; charset=utf-8',
			'Transfer-Encoding',
			'chunked',
			'Connection',
			'close',
			'Status',
			'200 OK',
			'X-RateLimit-Limit',
			'5000',
			'X-RateLimit-Remaining',
			'4555',
			'X-RateLimit-Reset',
			'1554215798',
			'Cache-Control',
			'private, max-age=60, s-maxage=60',
			'Vary',
			'Accept, Authorization, Cookie, X-GitHub-OTP',
			'ETag',
			'W/"9b3f2ceb558282d8d33beea50364d0e4"',
			'X-OAuth-Scopes',
			'repo',
			'X-Accepted-OAuth-Scopes',
			'admin:org, read:org, repo, user, write:org',
			'X-GitHub-Media-Type',
			'github.v3; format=json',
			'Access-Control-Expose-Headers',
			'ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type',
			'Access-Control-Allow-Origin',
			'*',
			'Strict-Transport-Security',
			'max-age=31536000; includeSubdomains; preload',
			'X-Frame-Options',
			'deny',
			'X-Content-Type-Options',
			'nosniff',
			'X-XSS-Protection',
			'1; mode=block',
			'Referrer-Policy',
			'origin-when-cross-origin, strict-origin-when-cross-origin',
			'Content-Security-Policy',
			"default-src 'none'",
			'Content-Encoding',
			'gzip',
			'X-GitHub-Request-Id',
			'37B1:1134:CDBE8A:201B0EE:5CA36565'
		]
	);
