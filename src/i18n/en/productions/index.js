import Classify from './classify';
import Common from './common';
import Keying from './keying';
import ProductionStart from './production_start';
import QC from './qc';
import VerifyKey from './verify_key';
import VerifyHold from './verify_hold';
import Invoice from './keying_invoice';
import Keyings from './keyings';
import DataViewer from './data_viewer';
import Training from './training';
import invoices from './invoices'
export default {
    invoices,
    common: Common,
    production_start: ProductionStart,
    qc: QC,
    keying: Keying,
    keyings: Keyings,
    training: Training,
    classify: Classify,
    verify_key: VerifyKey,
    verify_hold: VerifyHold,
    keying_invoice: Invoice,
    data_viewer: DataViewer
};
