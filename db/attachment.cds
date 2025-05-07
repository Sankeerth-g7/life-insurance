using { insurance } from './datamodel';
using { Attachments } from '@cap-js/sdm';

extend insurance.Applications with {
    attachments : Composition of many Attachments;
};
