import fs from 'fs-extra';
import path from 'path';

function deleteRemovedFiles(directory, newFiles, previousFiles) {
    // get all files that are not in the new filesystem and are still existing
    const filesToDelete = Object.keys(previousFiles)
        .filter(filename => !newFiles[filename])

    // delete each of these files
    return Promise.all(filesToDelete.map(filename => {
        return fs.unlink(path.join(directory, filename))
    }))
}

export default async function writeFileTree(dir, files, previousFiles) {
    if (previousFiles) {
        await deleteRemovedFiles(dir, files, previousFiles)
    }
    Object.keys(files).forEach((name) => {
        const filePath = path.join(dir, name)
        fs.ensureDirSync(path.dirname(filePath))
        fs.writeFileSync(filePath, files[name])
    })
}