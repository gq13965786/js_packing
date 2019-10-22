Object.assign(ape, (function () {
  'use strict';

  var Quat = function (x, y, z, w) {
    if (x && x.length === 4) {
      this.x = x[0];
      this.y = x[1];
      this.z = x[2];
      this.w = x[3];
    } else {
      this.x = (x === undefined) ? 0 : x;
      this.y = (y === undefined) ? 0 : y;
      this.z = (z === undefined) ? 0 : z;
      this.w = (w === undefined) ? 1 : w;
      }
  };

  Object.assign(Quat.prototype, {
    clone: function () {
      return new ape.Quat(this.x, this.y, this.z, this.w);
    },
    conjugate: function () {
      this.x *= -1;
      this.y *= -1;
      this.z *= -1;

      return this;
    },
    copy: function (rhs) {
      this.x = rhs.x;
      this.y = rhs.y;
      this.z = rhs.z;
      this.w = rhs.w;

      return this;
    },
    equals: function (rhs) {
      return ((this.x === rhs.x) && (this.y === rhs.y) && (this.z === rhs.z) && (this.w === rhs.w));
    },
    getAxisAngle: function (axis) {
      var rad = Math.acos(this.w) * 2;
      var s = Math.sin(rad / 2);
      if (s !== 0) {
        axis.x = this.x /s;
        axis.y = this.y /s;
        axis.z = this.z /s;
        if (axis.x < 0 || axis.y < 0 || axis.z < 0) {
          //Flip the sign反向正负符号
          axis.x *= -1;
          axis.y *= -1;
          axis.z *= -1;
          rad *= -1;
        }
      } else {
//If s is zero, return any axis (no rotation - axis does not matter)
          axis.x = 1;
          axis.y = 0;
          axis.z = 0;
      }
      return rad * ape.math.RAD_TO_DEG;
    },
    getEulerAngles: function (eulers) {
      var x, y, z, qx, qy, qz, qw, a2;

      eulers = (eulers === undefined) ? new ape.Vec3() : eulers;

      qx = this.x;
      qy = this.y;
      qz = this.z;
      qw = this.w;

      a2 = 2 * (qw * qy - qx * qz);
      if (a2 <= -0.99999) {
          x = 2 * Math.atan2(qx, qw);
          y = -Math.PI / 2;
          z = 0;
      } else if (a2 >= 0.99999) {
          x = 2 * Math.atan2(qx, qw);
          y = Math.PI / 2;
          z = 0;
      } else {
          x = Math.atan2(2 * (qw * qx + qy * qz), 1 - 2 * (qx * qx + qy * qy));
          y = Math.asin(a2);
          z = Math.atan2(2 * (qw * qz + qx * qy), 1 - 2 * (qy * qy + qz * qz));
      }

      return eulers.set(x, y, z).scale(ape.math.RAD_TO_DEG);
    },
    invert: function () {
      return this.conjugate().normalize();
    },
    length: function () {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    },
    lengthSq: function () {
      return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    },
    mul: function (rhs) {
      var q1x, q1y, q1z, q1w, q2x, q2y, q2z, q2w;

      q1x = this.x;
      q1y = this.y;
      q1z = this.z;
      q1w = this.w;

      q2x = rhs.x;
      q2y = rhs.y;
      q2z = rhs.z;
      q2w = rhs.w;

      this.x = q1w * q2x + q1x * q2w + q1y * q2z - q1z * q2y;
      this.y = q1w * q2y + q1y * q2w + q1z * q2x - q1x * q2z;
      this.z = q1w * q2z + q1z * q2w + q1x * q2y - q1y * q2x;
      this.w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;

      return this;
    },
    mul2: function (lhs, rhs) {
      var q1x, q1y, q1z, q1w, q2x, q2y, q2z, q2w;

      q1x = lhs.x;
      q1y = lhs.y;
      q1z = lhs.z;
      q1w = lhs.w;

      q2x = rhs.x;
      q2y = rhs.y;
      q2z = rhs.z;
      q2w = rhs.w;

      this.x = q1w * q2x + q1x * q2w + q1y * q2z - q1z * q2y;
      this.y = q1w * q2y + q1y * q2w + q1z * q2x - q1x * q2z;
      this.z = q1w * q2z + q1z * q2w + q1x * q2y - q1y * q2x;
      this.w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;

      return this;
    },
    normalize: function () {
      var len = this.length();
      if(len === 0) {
        this.x = this.y = this.z = 0;
        this.w = 1;
      } else {
        len = 1 / len;//the invert of length
        this.x *= len;
        this.y *= len;
        this.z *= len;
        this.w *= len;
      }

      return this;
    },
    set: function (x, y, z, w) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;

      return this;
    },
    setFromAxisAngle: function (axis, angle) {
      var sa, ca;

      angle *= 0.5 * ape.math.DEG_TO_RAD;

      sa = Math.sin(angle);
      ca = Math.cos(angle);

      this.x = sa * axis.x;
      this.y = sa * axis.y;
      this.z = sa * axis.z;
      this.w = ca;

      return this;
    },
    setFromEulerAngles: function (ex, ey, ez) {
      var sx, cx, sy, cy, sz, cz, halfToRad;

      halfToRad = 0.5 * ape.math.DEG_TO_RAD;
      ex *= halfToRad;
      ey *= halfToRad;
      ez *= halfToRad;

      sx = Math.sin(ex);
      cx = Math.cos(ex);
      sy = Math.sin(ey);
      cy = Math.cos(ey);
      sz = Math.sin(ez);
      cz = Math.cos(ez);

      this.x = sx * cy * cz - cx * sy * sz;
      this.y = cx * sy * cz + sx * cy * sz;
      this.z = cx * cy * sz - sx * sy * cz;
      this.w = cx * cy * cz + sx * sy * sz;

      return this;
    },
    setFromMat4: function (m) {
      var m00, m01, m02, m10, m11, m12, m20, m21, m22,
          tr, s, rs, lx, ly, lz;

      m = m.data;

      // Cache matrix values for super-speed
      m00 = m[0];
      m01 = m[1];
      m02 = m[2];
      m10 = m[4];
      m11 = m[5];
      m12 = m[6];
      m20 = m[8];
      m21 = m[9];
      m22 = m[10];

      // Remove the scale from the matrix
      lx = 1 / Math.sqrt(m00 * m00 + m01 * m01 + m02 * m02);
      ly = 1 / Math.sqrt(m10 * m10 + m11 * m11 + m12 * m12);
      lz = 1 / Math.sqrt(m20 * m20 + m21 * m21 + m22 * m22);

      m00 *= lx;
      m01 *= lx;
      m02 *= lx;
      m10 *= ly;
      m11 *= ly;
      m12 *= ly;
      m20 *= lz;
      m21 *= lz;
      m22 *= lz;

      // http://www.cs.ucr.edu/~vbz/resources/quatut.pdf

      tr = m00 + m11 + m22;
      if (tr >= 0) {
          s = Math.sqrt(tr + 1);
          this.w = s * 0.5;
          s = 0.5 / s;
          this.x = (m12 - m21) * s;
          this.y = (m20 - m02) * s;
          this.z = (m01 - m10) * s;
      } else {
          if (m00 > m11) {
              if (m00 > m22) {
                  // XDiagDomMatrix
                  rs = (m00 - (m11 + m22)) + 1;
                  rs = Math.sqrt(rs);

                  this.x = rs * 0.5;
                  rs = 0.5 / rs;
                  this.w = (m12 - m21) * rs;
                  this.y = (m01 + m10) * rs;
                  this.z = (m02 + m20) * rs;
              } else {
                  // ZDiagDomMatrix
                  rs = (m22 - (m00 + m11)) + 1;
                  rs = Math.sqrt(rs);

                  this.z = rs * 0.5;
                  rs = 0.5 / rs;
                  this.w = (m01 - m10) * rs;
                  this.x = (m20 + m02) * rs;
                  this.y = (m21 + m12) * rs;
              }
          } else if (m11 > m22) {
              // YDiagDomMatrix
              rs = (m11 - (m22 + m00)) + 1;
              rs = Math.sqrt(rs);

              this.y = rs * 0.5;
              rs = 0.5 / rs;
              this.w = (m20 - m02) * rs;
              this.z = (m12 + m21) * rs;
              this.x = (m10 + m01) * rs;
          } else {
              // ZDiagDomMatrix
              rs = (m22 - (m00 + m11)) + 1;
              rs = Math.sqrt(rs);

              this.z = rs * 0.5;
              rs = 0.5 / rs;
              this.w = (m01 - m10) * rs;
              this.x = (m20 + m02) * rs;
              this.y = (m21 + m12) * rs;
          }
      }

      return this;
    },
    slerp: function (lhs, rhs, alpha) {
      // Algorithm sourced from:
      // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
      var lx, ly, lz, lw, rx, ry, rz, rw;
      lx = lhs.x;
      ly = lhs.y;
      lz = lhs.z;
      lw = lhs.w;
      rx = rhs.x;
      ry = rhs.y;
      rz = rhs.z;
      rw = rhs.w;

      // Calculate angle between them.
      var cosHalfTheta = lw * rw + lx * rx + ly * ry + lz * rz;

      if (cosHalfTheta < 0) {
          rw = -rw;
          rx = -rx;
          ry = -ry;
          rz = -rz;
          cosHalfTheta = -cosHalfTheta;
      }

      // If lhs == rhs or lhs == -rhs then theta == 0 and we can return lhs
      if (Math.abs(cosHalfTheta) >= 1) {
          this.w = lw;
          this.x = lx;
          this.y = ly;
          this.z = lz;
          return this;
      }

      // Calculate temporary values.
      var halfTheta = Math.acos(cosHalfTheta);
      var sinHalfTheta = Math.sqrt(1 - cosHalfTheta * cosHalfTheta);

      // If theta = 180 degrees then result is not fully defined
      // we could rotate around any axis normal to qa or qb
      if (Math.abs(sinHalfTheta) < 0.001) {
          this.w = (lw * 0.5 + rw * 0.5);
          this.x = (lx * 0.5 + rx * 0.5);
          this.y = (ly * 0.5 + ry * 0.5);
          this.z = (lz * 0.5 + rz * 0.5);
          return this;
      }

      var ratioA = Math.sin((1 - alpha) * halfTheta) / sinHalfTheta;
      var ratioB = Math.sin(alpha * halfTheta) / sinHalfTheta;

      // Calculate Quaternion.
      this.w = (lw * ratioA + rw * ratioB);
      this.x = (lx * ratioA + rx * ratioB);
      this.y = (ly * ratioA + ry * ratioB);
      this.z = (lz * ratioA + rz * ratioB);
      return this;
    },
    transformVector: function (vec, res) {
      if (res === undefined) {
          res = new ape.Vec3();
      }

      var x = vec.x, y = vec.y, z = vec.z;
      var qx = this.x, qy = this.y, qz = this.z, qw = this.w;

      // calculate quat * vec
      var ix = qw * x + qy * z - qz * y;
      var iy = qw * y + qz * x - qx * z;
      var iz = qw * z + qx * y - qy * x;
      var iw = -qx * x - qy * y - qz * z;

      // calculate result * inverse quat
      res.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
      res.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
      res.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

      return res;
    },
    toString: function () {
      return '[' + this.x + ', ' + this.y + ', ' + this.z + ', ' + this.w + ']';
    }
  });

  Object.defineProperty(Quat, 'IDENTITY', {
    get: (function () {
      var identity = new Quat();//0,0,0,1
      return function () {
        return identity;
      };
    }())
  });

  Object.defineProperty(Quat, 'ZERO', {
    get: (function () {
        var zero = new Quat(0, 0, 0, 0);
        return function () {
          return zero;
        };
    }())
  });

  return {
    Quat: Quat
  };
}()));
