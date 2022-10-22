ALTER TABLE `matrimony_dev`.`admin` 
ADD COLUMN `name` VARCHAR(50) NULL AFTER `id`,
ADD COLUMN `role_id` INT NOT NULL AFTER `username`,
ADD COLUMN `dob` DATE NULL AFTER `role_id`,
ADD COLUMN `date_of_joining` DATETIME NULL AFTER `earnings_id`,
ADD COLUMN `candiate_referal_code` VARCHAR(45) NULL AFTER `updated_at`,
ADD COLUMN `designation` VARCHAR(45) NULL AFTER `candiate_referal_code`,
ADD COLUMN `edit_access` TINYINT NULL AFTER `designation`,
ADD COLUMN `payment_permission` TINYINT NULL AFTER `edit_access`;
