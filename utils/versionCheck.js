const { execSync } = require('child_process')

let _hasVueCLI;

exports.hasVueCLI = () => {
    if (_hasVueCLI != null) {
        return _hasVueCLI;
    }
    try {
        execSync('vue --version', { stdio: 'ignore' });
        return (_hasVueCLI = true);
    } catch (e) {
        return (_hasVueCLI = false);
    }
}