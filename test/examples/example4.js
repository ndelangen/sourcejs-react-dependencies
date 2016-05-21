import bluebird from 'bluebird';
import localModule from './module';
import localStyle from './module.css';

const example = 1;
const message = "An example loading a npm module, a local module and a css file";

export default {
	npm: bluebird,
	module: localModule,
	css: localStyle
};
