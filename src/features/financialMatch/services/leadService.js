/**
 * Lead Service — submits lead data to Bajaj LMS.
 * Wraps submitToLMS from apiClient for convenience.
 */

import { submitToLMS } from './apiClient.js';

/**
 * Submit lead to LMS with full payload structure.
 * Fails gracefully — never blocks UI flow.
 */
export async function submitLead(data) {
    return submitToLMS({
        name: data.name || '',
        mobile_no: data.mobile || '',
        param4: data.preferredDate || null,
        param19: data.preferredSlot || '',
        summary_dtls: data.summary || 'Balance Builder — Lead',
        p_data_source: data.dataSource || 'BALANCE_BUILDER_LEAD',
    });
}

/**
 * Submit early exit lead (partial score).
 */
export async function submitEarlyExitLead(data) {
    return submitLead({
        ...data,
        summary: 'Balance Builder — Early Exit',
        dataSource: 'BALANCE_BUILDER_EXIT',
    });
}

/**
 * Submit slot booking lead.
 */
export async function submitBookingLead(data) {
    return submitLead({
        ...data,
        summary: 'Balance Builder — Slot Booking',
        dataSource: 'BALANCE_BUILDER_BOOKING',
    });
}
