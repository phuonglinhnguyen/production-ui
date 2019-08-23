import clone from 'clone';
import { getInfoTask, getVertices } from '../../../../utils';
import {
	b64DecodeUnicode,
	b64EncodeUnicode,
	getDataObject,
	crudGetOne
} from '@dgtx/coreui';
import {
	getFieldRecord,
	getFieldSection,
	findFieldNextSectionMultiple,
	findFieldNextSectionSingle
} from '../../../../@components/FormInput';
import {
	loadDataRecends,
	setIn,
	analysisDynamicFields
} from '../../../../@components/FormInput/utils';

import { loadDataForm } from '../../../../@components/FormInput';

export const LOADED_DATA_FORM = '@FORM_STATE/LOADED_DATA_FORM';
export const CLEAR_DATA_FORM = '@FORM_STATE/CLEAN_DATA_FORM';
export const SHOW_COMMENT_SAVE = '@FORM_STATE/SHOW_COMMENT_SAVE';
export const HIDE_COMMENT_SAVE = '@FORM_STATE/HIDE_COMMENT_SAVE';
export const CHANGE_COMMENT_SAVE = '@FORM_STATE/CHANGE_COMMENT_SAVE';
export const CHANGE_IS_NEXT = '@FORM_STATE/CHANGE_IS_NEXT';
export const TASK_PATCHING = '@FORM_STATE/TASK_PATCHING';
export const TASK_TRY_PATCH = '@FORM_STATE/TASK_TRY_PATCH';
export const CANCEL_TASK_TRY_PATCH = '@FORM_STATE/CANCEL_TASK_TRY_PATCH';
export const TASK_PATCH_FAILURED = '@FORM_STATE/TASK_PATCH_FAILURED';
export const SET_LOADING_FORM = '@FORM_STATE/TASK_LOADING_FORM';
export const getNoRecord = (sections = []) => {
	let noRecord = NaN;
	sections.forEach((section) => {
		if (getDataObject('settings.multiple.is_multiple', section)) {
			noRecord = getDataObject('settings.multiple.record_no', section);
			noRecord = isNaN(Number(noRecord)) ? 0 : Number(noRecord);
		}
	});
	return noRecord;
};
export const setLoadingForm = (isLoading = true) => ({
	type: SET_LOADING_FORM,
	payload: isLoading,
	meta: {
		resource: 'form_state'
	}
});
export const setFormStatePatching = () => ({
	type: TASK_PATCHING,
	meta: {
		resource: 'form_state'
	}
});
export const setFormStateTryPatch = (payload) => ({
	type: TASK_TRY_PATCH,
	payload: payload,
	meta: {
		resource: 'form_state'
	}
});
export const cancelTryPatch = (payload) => ({
	type: CANCEL_TASK_TRY_PATCH,
	payload: payload,
	meta: {
		resource: 'form_state'
	}
});
export const setFormStatePatchFailured = () => ({
	type: TASK_PATCH_FAILURED,
	meta: {
		resource: 'form_state'
	}
});
export const cleanFormState = () => ({
	type: CLEAR_DATA_FORM,
	payload: {},
	meta: {
		resource: 'form_state'
	}
});
export const showCommentSave = (option) => ({
	type: SHOW_COMMENT_SAVE,
	payload: { option },
	meta: {
		resource: 'form_state'
	}
});
export const hideCommentSave = (option) => ({
	type: HIDE_COMMENT_SAVE,
	payload: { option },
	meta: {
		resource: 'form_state'
	}
});
export const changeCommentSave = (value) => ({
	type: CHANGE_COMMENT_SAVE,
	payload: { value },
	meta: {
		resource: 'form_state'
	}
});
export const updateNextTask = (isNext) => ({
	type: CHANGE_IS_NEXT,
	payload: { isNext },
	meta: {
		resource: 'form_state'
	}
});
const getLookupLang = (sections) => {
	try {
		for (let item of sections) {
			if (item.settings.lookup_lang) {
				return {
					sectionName: item.name,
					fieldName: item.settings.lookup_lang
				}
			}
		}
	} catch (_) {

	}
	return;
}
const setValueDefault = (values, sections) => {
	values.forEach(value => {
		sections.forEach(section => {
			let fields = section.fields;
			value[section.name].forEach(data => {
				fields.forEach(field => {
					if (field.default_value) {
						if (!data[field.name]) {
							data[field.name] = { text: field.default_value, words: [] }
						}
					}
				})
			});
		})
	});
}

const getDataFieldOcr = (data) => {
	let { text, position, valid_status, line_index, note, confidence } = data.ocr_values[0];
	if (position) {
		let word = {
			text,
			position,
			valid_status,
			line_index,
			confidence,
			note,
			data: data.ocr_values[0],
			boundingBox: {
				vertices: getVertices(position)
			}
		};
		return {
			text: `${text}`,
			confidence,
			words: [
				word
			]
		};
	}
	return {
		text: `${text || ''}`,
		words: []
	};
};

const analyticDataExtract = (datas) => {
	let result = {};
	datas.forEach((img, imgId) => {
		img &&
			Array.isArray(img.ocr_results) &&
			img.ocr_results.forEach((field) => {
				result[field.field_name] = result[field.field_name]
					? [
						...result[field.field_name],
						{ ...field, imgId }
					]
					: [
						{ ...field, imgId }
					];
			});
	});
	return result;
};
const setFocusField = (sections, fields) => {
	let props = {
		rowId: 0,
		current: 0,
		fieldId: -1,
		sectionId: 0,
		fields: fields[0],
		sectionName: sections[0].name,
		sections,
		goto: 'down',
		values: [
			{}
		]
	};
	let { fieldNext } = sections[0].is_multiple
		? findFieldNextSectionMultiple(props)
		: findFieldNextSectionSingle(props);
	// setIn(fields[0], { ...fieldNext, key: 'active' }, true)
	return fieldNext;
};
const setReworkFields = (reworkFields, fields) => {
	if (Array.isArray(reworkFields) && reworkFields.length) {
		fields.forEach((field) => {
			Object.values(field).forEach((records) => {
				records.forEach((record) => {
					Object.keys(record).forEach((fieldName) => {
						if (!reworkFields.includes(fieldName)) {
							record[fieldName].disable = true;
						}
					});
				});
			});
		});
	}
	return fields;
};
const loadDataOcrInvoice = (datas, dataTask, isFill = true) => ({
	sections
}) => {
	let result = {};
	let noRecord = getNoRecord(sections);
	let single = isNaN(noRecord);
	let dataFields = analyticDataExtract(datas);
	sections.forEach((section) => {
		if (section.is_multiple) {
			result[section.name] = [
				{}
			];
		} else {
			let record = {};
			section.fields.forEach((field) => {
				if (dataFields[field.name]) {
					record[field.name] = !field.field_setting
						.disable_auto_fill_ocr
						? getDataFieldOcr(dataFields[field.name][0])
						: { text: field.default_value, words: [] };
				} else {
					record[field.name] = {
						text: field.default_value,
						words: []
					};
				}
			});
			result[section.name] = [
				record
			];
		}
	});
	let _values = [
		result
	];
	if (noRecord > 1) {
		for (let index = 0; index < noRecord - 1; index++) {
			let _record = {};
			sections.forEach((section) => {
				_record[section.name] = [
					{}
				];
			});
			_values.push(_record);
		}
	}
	let _fields = [];
	for (let index = 0; index < _values.length; index++) {
		let _record = _values[index];
		let fields = {};
		sections.forEach((section) => {
			fields[section.name] = [];
			for (let index = 0; index < _record[section.name].length; index++) {
				fields[section.name].push(getFieldSection(section, _record[section.name][index]));
			}
		});
		_fields.push(fields);
	}
	setReworkFields(dataTask.rework_fields, _fields);
	let fieldActive = setFocusField(sections, _fields);
	let isDynamic = analysisDynamicFields(_fields, _values);
	let lookup_lang = getLookupLang(sections);
	setValueDefault(_values, sections)
	return {
		value: clone(_values[0]),
		values: _values,
		fields: _fields,
		taskId: dataTask.taskId,
		active: fieldActive,
		single,
		isDynamic,
		lookup_lang,
		dataExtract: dataFields
	};
};
const loadDataRecent = (values, dataTask) => ({ sections, fields }) => {
	let _fields = [];
	let noRecord = getNoRecord(sections);
	let single = isNaN(noRecord);
	for (let index = 0; index < values.length; index++) {
		let _record = values[index];
		let fields = {};
		sections.forEach((section) => {
			if (_record[section.name]) {
				fields[section.name] = [];
				for (
					let index = 0;
					index < _record[section.name].length;
					index++
				) {

					fields[section.name].push(getFieldSection(section, _record[section.name][index]));
				}
			} else {
				fields[section.name] = [
					getFieldSection(section)
				];
			}
		});
		_fields.push(fields);
	}
	setReworkFields(dataTask.rework_fields, _fields);
	let fieldActive = setFocusField(sections, _fields);
	let isDynamic = analysisDynamicFields(_fields, values);
	let dataExtract = analyticDataExtract(dataTask.dataExtract);
	let lookup_lang = getLookupLang(sections);
	setValueDefault(values, sections)
	return {
		value: clone(values[0]),
		values,
		fields: _fields,
		taskId: dataTask.taskId,
		active: fieldActive,
		single,
		isDynamic,
		lookup_lang,
		dataExtract
	};
};
const loadDataKeyDatasPause = (values, dataTask) => ({ sections, fields }) => {
	let _fields = [];
	let noRecord = getNoRecord(sections);
	let single = isNaN(noRecord);
	for (let index = 0; index < values.length; index++) {
		let _record = values[index];
		let fields = {};
		sections.forEach((section) => {
			if (_record[section.name]) {
				fields[section.name] = [];
				for (
					let index = 0;
					index < _record[section.name].length;
					index++
				) {
					fields[section.name].push(getFieldSection(section, _record[section.name][index]));
				}
			} else {
				fields[section.name] = [
					getFieldSection(section)
				];
			}
		});
		_fields.push(fields);
	}
	let fieldActive = setFocusField(sections, _fields);
	let isDynamic = analysisDynamicFields(_fields, values);
	let dataExtract = analyticDataExtract(dataTask.dataExtract);
	let lookup_lang = getLookupLang(sections);
	setValueDefault(values, sections)
	return {
		value: clone(values[0]),
		values,
		fields: _fields,
		taskId: dataTask.taskId,
		active: fieldActive,
		single,
		isDynamic,
		lookup_lang,
		dataExtract
	};
};

const loadDataKeyDatas = (values, dataTask) => ({ sections, fields }) => {
	let _values = [];
	let noRecord = getNoRecord(sections);
	let sectionNames = sections.map((item) => item.name);
	let single = isNaN(noRecord);
	if (single) {
		noRecord = Math.max(values.length, 1);
	} else {
		noRecord = Math.max(noRecord, values.length, 1);
	}
	if (noRecord > values.length) {
		for (let index = 0; index < noRecord; index++) {
			let _record = {};
			if (values[index]) {
				values[index].forEach((section) => {
					if (sectionNames.includes(section.section)) {
						_record[section.section] = section.data;
					}
				});
			} else {
				sections.forEach((section) => {
					_record[section.name] = [
						{}
					];
				});
			}
			_values.push(_record);
		}
	} else {
		_values = values.map((item) => {
			let _record = {};
			item.forEach((section) => {
				if (sectionNames.includes(section.section)) {
					_record[section.section] = section.data;
				}
			});
			return _record;
		});
	}
	let _fields = [];
	for (let index = 0; index < _values.length; index++) {
		let _record = _values[index];
		let fields = {};
		sections.forEach((section) => {
			fields[section.name] = [];
			if (_record[section.name] && _record[section.name].length) {
				if (_record[section.name].length) {
					for (
						let index = 0;
						index < _record[section.name].length;
						index++
					) {
						fields[section.name].push(getFieldSection(section, _record[section.name][index]));
					}
				} else {
					fields[section.name].push(getFieldSection(section));
				}
			} else {
				fields[section.name].push(getFieldSection(section));
			}
		});
		_fields.push(fields);
	}
	// for (let index = 0; index < values.length; index++) {
	//     let _record = values[index];
	//     let fields = {};
	//     sections.forEach(section => {
	//         if (_record[section.name]) {
	//             fields[section.name] = [];
	//             for (let index = 0; index < _record[section.name].length; index++) {
	//                 fields[section.name].push(getFieldSection(section))
	//             }
	//         } else {
	//             fields[section.name] = [getFieldSection(section)]
	//         }
	//     });
	//     ;
	//     _fields.push(fields)
	// }
	setReworkFields(dataTask.rework_fields, _fields);
	let fieldActive = setFocusField(sections, _fields);
	let isDynamic = analysisDynamicFields(_fields, _values);
	let dataExtract = analyticDataExtract(dataTask.dataExtract);
	// dataTask.dataExtract
	let lookup_lang = getLookupLang(sections);
	setValueDefault(_values, sections)
	return {
		value: clone(_values[0]),
		values: _values,
		fields: _fields,
		taskId: dataTask.taskId,
		active: fieldActive,
		single,
		isDynamic,
		lookup_lang,
		dataExtract
	};
};
export const loadData = ({ projectId, layoutName, taskKeyDef, data }) => async (
	dispatch
) => {
	let dataTask = await getInfoTask(data);
	let dataRecends = loadDataRecends(dataTask.taskId);
	if (dataRecends) {
		dispatch(loadDataForm(loadDataRecent(dataRecends, dataTask)));
		dispatch({
			type: LOADED_DATA_FORM,
			payload: {
				...dataTask,
				projectId,
				layoutName,
				taskKeyDef
			},
			meta: {
				resource: 'form_state'
			}
		});
	} else {
		dispatch(
			crudGetOne(
				'document_pause',
				{
					projectId,
					taskId: dataTask.taskId,
					username: dataTask.assignee
				},
				{
					onSuccess: ({ result: { data } }) => {
						let _data = data[0] ? data[0] : data;
						let _pauses = _data.pauses[0]
							? _data.pauses[0]
							: _data.pauses;
						dispatch(
							loadDataForm(
								loadDataKeyDatasPause(_pauses.values, dataTask)
							)
						);
						dispatch({
							type: LOADED_DATA_FORM,
							payload: {
								...dataTask,
								projectId,
								layoutName,
								taskKeyDef
							},
							meta: {
								resource: 'form_state'
							}
						});
					},
					onFailure: () => {
						if (dataTask.key_datas || dataTask.key_data) {
							dispatch(
								loadDataForm(
									loadDataKeyDatas(
										dataTask.key_datas || dataTask.key_data,
										dataTask
									)
								)
							);
						} else {
							if (dataTask.dataExtract) {
								dispatch(
									loadDataForm(
										loadDataOcrInvoice(
											dataTask.dataExtract,
											dataTask
										)
									)
								);
							} else {
								dispatch(
									loadDataForm(loadDataKeyDatas([], dataTask))
								);
							}
						}
						dispatch({
							type: LOADED_DATA_FORM,
							payload: {
								...dataTask,
								projectId,
								layoutName,
								taskKeyDef
							},
							meta: {
								resource: 'form_state'
							}
						});
					}
				}
			)
		);
	}
};
