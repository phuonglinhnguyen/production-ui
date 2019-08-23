import { getLookupService } from './worker_service';
import { getSubjectBroadcast } from './observice_broadcast/subject';
import { getStorageFieldCapture } from './store_field_capture'
export const LookupService = getLookupService();
export const FieldBroadcastService = getSubjectBroadcast();
export const StorageFieldCaptureService = getStorageFieldCapture();

export default {
    LookupService,
    FieldBroadcastService,
    StorageFieldCaptureService,
}