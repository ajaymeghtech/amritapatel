'use client';

import React from 'react';
import styles from '@/app/styles/scss/components/home.module.scss';
import Link from "next/link";

export default function ConnectTab() {
  return (
    <div className={styles.connectTab}>
      <Link href="/contact-us" className={styles.connectTabContent}>
        Connect With Us
      </Link>
    </div>
  );
}

