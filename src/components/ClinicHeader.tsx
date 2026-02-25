import Image from 'next/image';

export default function ClinicHeader({ size = 'normal' }: { size?: 'normal' | 'small' }) {
  const isSmall = size === 'small';

  return (
    <div className={`text-center ${isSmall ? 'py-3' : 'py-6'}`}>
      <Image src="/images/logo.png" alt="Holy Care Dental" width={isSmall ? 40 : 56} height={isSmall ? 40 : 56} className={`mx-auto mb-2 ${isSmall ? 'w-10 h-10' : 'w-14 h-14'}`} />
      <h1 className={`${isSmall ? 'text-lg' : 'text-2xl'} font-bold font-heading text-primary-700`}>
        HOLY CARE DENTAL &amp; ORTHODONTICS CLINIC
      </h1>
      <p className={`${isSmall ? 'text-xs' : 'text-sm'} text-body mt-1`}>
        <span className="font-semibold">Dr. Pinky Vijay MDS</span>
        {' '}| Orthodontics &amp; Dentofacial Orthopedics
      </p>
      <p className={`${isSmall ? 'text-xs' : 'text-sm'} text-muted`}>
        Reg. No: A-34195 | Ph: +91 79772 57779
      </p>
      <p className={`${isSmall ? 'text-xs' : 'text-sm'} text-muted`}>
        8/277, Rachel Enclave, Kavalkinaru Main Road, Kavalkinaru - 627105
      </p>
    </div>
  );
}
