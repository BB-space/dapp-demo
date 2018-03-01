/* eslint-disable no-console */

const isBuildEnv = process.env.NODE_ENV === 'build';


export default async function renderApp(ctx) {
    const renderData = {
        reactHtml: '',
        stateString: '{}',
        isBuildEnv,
        helmet: false,
		ethEnv: process.env.ETH_ENV
    };
    
    await ctx.render('index', renderData);
}
