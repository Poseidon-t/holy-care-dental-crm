import Image from 'next/image';

export interface ClinicInfo {
  name: string;
  doctor_name?: string | null;
  specialization?: string | null;
  registration_number?: string | null;
  phone?: string | null;
  address?: string | null;
  logo_url?: string | null;
}

export default function ClinicHeader({ size = 'normal', clinic }: { size?: 'normal' | 'small'; clinic?: ClinicInfo }) {
  const isSmall = size === 'small';
  const clinicName = clinic?.name || 'Clinic';
  const doctorName = clinic?.doctor_name;
  const specialization = clinic?.specialization;
  const regNumber = clinic?.registration_number;
  const phone = clinic?.phone;
  const address = clinic?.address;
  const logoUrl = clinic?.logo_url || '/images/logo.png';

  return (
    <div className={`text-center ${isSmall ? 'py-3' : 'py-6'}`}>
      <Image src={logoUrl} alt={clinicName} width={isSmall ? 40 : 56} height={isSmall ? 40 : 56} className={`mx-auto mb-2 ${isSmall ? 'w-10 h-10' : 'w-14 h-14'}`} />
      <h1 className={`${isSmall ? 'text-lg' : 'text-2xl'} font-bold font-heading text-primary-700`}>
        {clinicName.toUpperCase()}
      </h1>
      {doctorName && (
        <p className={`${isSmall ? 'text-xs' : 'text-sm'} text-body mt-1`}>
          <span className="font-semibold">{doctorName}</span>
          {specialization && <> | {specialization}</>}
        </p>
      )}
      {(regNumber || phone) && (
        <p className={`${isSmall ? 'text-xs' : 'text-sm'} text-muted`}>
          {regNumber && <>Reg. No: {regNumber}</>}
          {regNumber && phone && ' | '}
          {phone && <>Ph: {phone}</>}
        </p>
      )}
      {address && (
        <p className={`${isSmall ? 'text-xs' : 'text-sm'} text-muted`}>
          {address}
        </p>
      )}
    </div>
  );
}
