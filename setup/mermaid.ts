import { defineMermaidSetup } from '@slidev/types';

export default defineMermaidSetup(() => {
	return {
		theme: 'neutral',
		themeVariables: {
			fontSize: '15px',
			fontFamily:
				'-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
		},
	};
});
