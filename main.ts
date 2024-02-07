import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian'

// Remember to rename these classes and interfaces!

interface AgendaPluginSettings {
}

const DEFAULT_SETTINGS: AgendaPluginSettings = {
}

export default class AgendaPlugin extends Plugin {
	settings: AgendaPluginSettings

	async onload() {
		await this.loadSettings()
		const files = this.app.vault.getMarkdownFiles();
		files.forEach(async (file) => {
			const content = await this.app.vault.cachedRead(file);
			content.split("\n").forEach((line) => {
				if (line[0] == '#') {
					new Notice("Task: " + line.replace(new RegExp("#*"),"")) 
				}
			});
		});
		
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app)
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!')
	}

	onClose() {
		const {contentEl} = this
		contentEl.empty()
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: AgendaPlugin;

	constructor(app: App, plugin: AgendaPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const {containerEl} = this

		containerEl.empty()

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.onChange(async (value) => {
					await this.plugin.saveSettings()
				}))
	}
}
