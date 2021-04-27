import { IInputs, IOutputs } from "./generated/ManifestTypes";
import ReactDOM = require("react-dom");
import React = require("react");
import { ISearchButtonProps, SearchButton } from "./Controls/SearchButton";
export class CeoAuthenticationLogSearch implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private _container: HTMLDivElement;
	private _inputCeoUserId: string = "";
	private _inputCeoCompanyId: string = "";
	private _inputElement: React.ReactElement;
	private _notifyOutputChanged: () => void;
	private _context: ComponentFramework.Context<IInputs>;
	private searchProps: ISearchButtonProps;
	private _outputCeoSearch: string;
	constructor() {
		this.onClickHandler = this.onClickHandler.bind(this);
		this.searchProps = {
			onClick: this.onClickHandler,
			companyId: '',
			userId: '',
			disabled: false,
			context: this._context,
			isModalOpen: false
		}
		this._outputCeoSearch = "";
	}

	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		this._container = container;
		this._notifyOutputChanged = notifyOutputChanged;

		if ((context.parameters.ceoCompanyId !== null && context.parameters.ceoCompanyId !== undefined)
			&& (context.parameters.ceoCompanyId.raw !== null && context.parameters.ceoCompanyId.raw !== undefined)) {
			this._inputCeoCompanyId = context.parameters.ceoCompanyId.raw || "";
			this.searchProps.companyId = this._inputCeoCompanyId;
		}
		if ((context.parameters.ceoUserId !== null && context.parameters.ceoUserId !== undefined)
			&& (context.parameters.ceoUserId.raw !== null && context.parameters.ceoUserId.raw !== undefined)) {
			this._inputCeoUserId = context.parameters.ceoUserId.raw || "";
			this.searchProps.userId = this._inputCeoUserId;
		}
		if ((context.parameters.ceoSearch !== null && context.parameters.ceoSearch !== undefined)
			&& (context.parameters.ceoSearch.raw !== null && context.parameters.ceoSearch.raw !== undefined)) {
			this._outputCeoSearch = context.parameters.ceoSearch.raw;
			this.searchProps.ceoSearch = this._outputCeoSearch;
		}
		this.searchProps.disabled = (this._inputCeoUserId.length === 0) || (this._inputCeoCompanyId.length === 0);
	}

	public updateView(context: ComponentFramework.Context<IInputs>): void {

		if ((context.parameters.ceoCompanyId !== null && context.parameters.ceoCompanyId !== undefined)
			&& (context.parameters.ceoCompanyId.raw !== null && context.parameters.ceoCompanyId.raw !== undefined)) {
			this._inputCeoCompanyId = context.parameters.ceoCompanyId.raw || "";
			this.searchProps.companyId = this._inputCeoCompanyId;
		}
		if ((context.parameters.ceoUserId !== null && context.parameters.ceoUserId !== undefined)
			&& (context.parameters.ceoUserId.raw !== null && context.parameters.ceoUserId.raw !== undefined)) {
			this._inputCeoUserId = context.parameters.ceoUserId.raw || "";
			this.searchProps.userId = this._inputCeoUserId;
		}

		if ((context.parameters.ceoSearch !== null && context.parameters.ceoSearch !== undefined)
			&& (context.parameters.ceoSearch.raw !== null && context.parameters.ceoSearch.raw !== undefined)) {
			this._outputCeoSearch = context.parameters.ceoSearch.raw;
			this.searchProps.ceoSearch = this._outputCeoSearch;
		}

		this.searchProps.disabled = (this._inputCeoUserId.length === 0) || (this._inputCeoCompanyId.length === 0);
		this.searchProps.context = context;

		this.renderControl(context);
	}

	private renderControl(context: ComponentFramework.Context<IInputs>) {
		ReactDOM.render(this._inputElement = React.createElement(SearchButton, this.searchProps), this._container);
	}

	public onClickHandler(event: any) {
		this._outputCeoSearch = JSON.stringify(event);
		console.log("on Click Handler: " + this._outputCeoSearch);
		this._notifyOutputChanged();
	}

	public getOutputs(): IOutputs {
		console.log("Returning Output... " + this._outputCeoSearch);
		return {
			ceoSearch: this._outputCeoSearch,
			ceoUserId: this._inputCeoUserId, ceoCompanyId: this._inputCeoCompanyId
		};
	}

	public destroy(): void {
		ReactDOM.unmountComponentAtNode(this._container);
	}
}
