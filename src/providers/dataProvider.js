import resourceRegistry from './resourceRegistry'

export default (type, resource, params) => {
    return  resourceRegistry[resource](type, resource, params);
};
