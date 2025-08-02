-- This migration adds a 'phone' column to the 'reports' table to store the reporter's phone number for SMS alerts.

ALTER TABLE public.reports
ADD COLUMN phone TEXT;

-- You can optionally add a comment to describe the new column.
COMMENT ON COLUMN public.reports.phone IS 'The phone number of the person who submitted the report, used for sending high-urgency alerts.';
