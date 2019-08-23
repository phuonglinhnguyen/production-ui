const forms = [
  {
    path: 'classifying/1/false/#{project_id}/0/0/#{task_id}',
    name: 'Classify Single'
  },
  {
    path: 'classifying/1/true/#{project_id}/0/0/#{task_id}',
    name: 'Classify Multiple'
  },
  {
    path: 'classifying/12/true/#{project_id}/0/0/#{task_id}',
    name: 'Classify Docset'
  },
  {
    path: 'keying/#{project_id}/#{layout_name}/#{section_name}/#{task_id}',
    name: 'Key Single'
  },
  {
    path: 'keyings/#{project_id}/#{layout_name}/#{section_name}/#{task_id}',
    name: 'Key Multiple'
  },
  {
    path:
      'verifying/key/#{project_id}/#{layout_name}/#{section_name}/#{task_id}',
    name: 'Verify Keying'
  },
  {
    path: 'omr/#{project_id}/#{layout_name}/#{section_name}/#{task_id}',
    name: 'OMR'
  },
  {
    path:
      'verifying/omr/#{project_id}/#{layout_name}/#{section_name}/#{task_id}',
    name: 'Verify OMR'
  },
  {
    path: 'qc_single/#{project_id}/#{layout_name}/#{task_id}',
    name: 'QC Single'
  },
  {
    path: 'qc/#{project_id}/#{layout_name}/#{task_id}',
    name: 'QC Multiple'
  },
  {
    path: 'verifying/hold/10/true/#{project_id}/#{task_id}',
    name: 'Verify Hold'
  },
  {
    path: 'invoice/#{project_id}/keying/#{layout_name}/#{task_id}',
    name: 'Invoice Keying'
  },
  {
    path: 'invoice/#{project_id}/proof/#{layout_name}/#{task_id}',
    name: 'Invoice Proof'
  },
  {
    path: 'invoice/#{project_id}/qc/#{layout_name}/#{task_id}',
    name: 'Invoice QC'
  },
  {
    path: 'grouping/#{project_id}/0/0/#{task_id}',
    name: 'Grouping images'
  }
];
export default forms;
