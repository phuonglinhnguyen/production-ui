export const executeObserver = async (observice, topic, data) => {
    let _data = { ...data, topic };
    try {
        observice(_data);
    } catch (error) { } //esline-disable-line no-unused-vars
}

export default class ObserviceList {
    constructor(channel) {
        this.channel = channel;
        this.topicList = new Map();
    }
    publish = (topic, data) => {
        let topics = this.topicList.get(topic);
        if (topics) {
            topics.forEach((observice) => {
                executeObserver(observice, topic, data);
            });
        }
    }
    _addOnceTopic = (name, observice) => {
        let topics = this.topicList.get(name);
        if (topics) {
            if (!topics.has(observice)) {
                topics.add(observice);
            }
        } else {
            topics = new Set();
            topics.add(observice);
            this.topicList.set(name, topics);
        }
    }
    addTopic = (name, observice) => {
        const seft = this;
        if (Array.isArray(name)) {
            name.forEach(_name => {
                seft._addOnceTopic(_name, observice);
            })
        } else {
            seft._addOnceTopic(name, observice);
        }

    }
    removeTopic = (name, observice) => {
        const seft = this;
        if (Array.isArray(name)) {
            if (observice) {
                name.forEach(_name => {
                    let topics = seft.topicList.get(_name);
                    if (topics) {
                        topics.delete(observice);
                        if (topics.size === 0)
                            seft.topicList.delete(_name);
                    }
                })
            } else {
                name.forEach(_name => {
                    seft.topicList.delete(_name);
                });
            }
        } else {
            if (observice) {
                let topics = seft.topicList.get(name);
                if (topics) {
                    topics.delete(observice);
                    if (topics.size === 0)
                        seft.topicList.delete(name);
                }
            } else {
                seft.topicList.delete(name);
            }
        }
        return seft.topicList.size;
    }
}