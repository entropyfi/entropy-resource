const fs = require('fs')
const path = require('path')
const filePath = path.resolve(__dirname, '../')
const fileArr = []
const ignores = [
	'node_modules',
	'dist',
	'.git',
	'.github',
	'autoIndex',
	'README.md',
	'Entropyfi.png',
	'Entropyfi.svg'
] //ignores
const charSet = {
	node: '- ', // 节点
	indent: '  ' // 缩进
}

const readFile = (path, level) => {
	const files = fs.readdirSync(path)
	files.forEach((filename, index) => {
		if (ignores.includes(filename)) console.log(`[ignores] ${filename}`)
		else {
			const stats = fs.statSync(path + '/' + filename)
			if (stats.isFile()) {
				// File
				if (level === 1) fileArr.push(charSet.node + filename)
				else {
					let indentArr = ''
					for (let i = 2; i < level; i++) {
						indentArr += charSet.indent
					}
					const showFileName = filename.split('.')
					const splitName = showFileName[0].split('_')
					let showNewName = ''

					if (splitName.length > 1) {
						showNewName += splitName[1]
						if (splitName[splitName.length - 2] == 'transparent')
							showNewName += ' `transparent`'
						else if (splitName[splitName.length - 1] == 'transparent')
							showNewName += ' `transparent`'
						else showNewName += `_${splitName[splitName.length - 1]}`
					} else showNewName = splitName[0]
					showNewName += ' `.' + showFileName[1] + '`'

					// MD
					fileArr.push(indentArr + charSet.node + showNewName)
				}
			} else if (stats.isDirectory()) {
				// Directory
				if (level === 1) fileArr.push(charSet.node + filename)
				else {
					let str = ''
					for (let i = 2; i < level; i++) {
						str += charSet.indent
					}
					// MD
					fileArr.push(str + charSet.node + `**${filename}**`)
				}
				readFile(path + '/' + filename, level + 1)
			}
		}
	})
}

//=> START
readFile(filePath, 2)

//=> Write README.md
const README_File = path.resolve(__dirname, '../README.md')
fs.exists(README_File, exists => {
	if (exists)
		fs.readFile(README_File, 'utf8', (err, data) => {
			const matchContent = data.split('<!-- JS!LOOKME! -->')

			const C =
				matchContent[0] +
				`<!-- JS!LOOKME! -->\n${fileArr.join('\n')}\n<!-- JS!LOOKME! -->` +
				matchContent[2]

			fs.writeFile(README_File, C, err => {
				console.log('写入文件失败')
			})

			console.log('Success !!!')
		})
})
