import { nextjsProfile } from '@alessiofrittoli/package-configs/eslint/profiles/nextjs'
import { eslintConfig } from '@alessiofrittoli/package-configs/eslint'

export default eslintConfig(...nextjsProfile, {
	rules: {
		// disable this rule since we have no `pages` or `app` folder.
		'@next/next/no-html-link-for-pages': 'off',
	},
})
