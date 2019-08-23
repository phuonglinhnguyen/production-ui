import ObserviceList from './observice_list';

const SubjectBroadcast = () => {
    if (SubjectBroadcast.instance !== undefined)
        return SubjectBroadcast.instance;
    var subjectList = new Map();
    var subjectDatas = new Map();
    SubjectBroadcast.instance = {
        changeData: (channel, topic, data) => {
            let _subjectData = subjectDatas.get(channel);
            if (!_subjectData) {
                _subjectData = {};
                subjectDatas.set(channel, _subjectData);
            }
            _subjectData[topic] = data;
        },
        getParam: (channel, func) => {
            let _subjectData = subjectDatas.get(channel);
            return func(_subjectData);
        },
        publish: async (channel, topic, data) => {
            let _ObserviceList = subjectList.get(channel);
            if (_ObserviceList) {
                _ObserviceList.publish(topic, data);
            }
            let _subjectData = subjectDatas.get(channel);
            if (!_subjectData) {
                _subjectData = {};
                subjectDatas.set(channel, _subjectData);
            }
            _subjectData[topic] = data.data;
        },
        subscribe: (channel, topic, observice) => {
            if (typeof channel === undefined) return;
            let _ObserviceList = subjectList.get(channel);
            if (!_ObserviceList) {
                _ObserviceList = new ObserviceList(channel);
                subjectList.set(channel, _ObserviceList);
            }
            _ObserviceList.addTopic(topic, observice);
        },
        unsubsribe: (channel, topic, observice) => {
            let _ObserviceList = subjectList.get(channel);
            if (_ObserviceList) {
                let obLength = _ObserviceList.removeTopic(topic, observice);
                if (0 === obLength) {
                    subjectList.delete(channel);
                    _ObserviceList = undefined;
                }
            }
            let _subjectData = subjectDatas.get(channel);
            if (_subjectData) {
                delete _subjectData[topic];
                if (!Object.keys(_subjectData).length) {
                    subjectDatas.delete(channel);
                }
            }
        },
    };
    return SubjectBroadcast.instance;
}
export const getSubjectBroadcast = () => {
    return new SubjectBroadcast();
}