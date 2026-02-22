export default function ClinicHeader({ size = 'normal' }: { size?: 'normal' | 'small' }) {
  const isSmall = size === 'small';

  return (
    <div className={`text-center ${isSmall ? 'py-3' : 'py-6'}`}>
      <div className={`${isSmall ? 'text-3xl' : 'text-5xl'} mb-2`}>🦷</div>
      <h1 className={`${isSmall ? 'text-lg' : 'text-2xl'} font-bold font-heading text-primary-700`}>
        HOLY CARE DENTAL &amp; ORTHODONTIC CLINIC
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
